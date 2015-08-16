define([], function () {
  'use strict';

  function LAB(ns, data, binder){
    this.data = data;
    this.ns = ns;
    this.binder = binder?binder:new LABBinder();
    this.get = function(ns, defVal){
      ns = lab.joinNs(this.ns, ns);
      var val = lab.get(ns, this.data, defVal)
      this.binder.dispatch(ns, 'get', [this]);
      return val;
    }
    this.set = function(ns, val){
      ns = lab.joinNs(this.ns, ns);
      lab.set(ns, this.data, val);
      this.binder.dispatch(ns, 'set', [this]);
      return this;
    }
    this.push = function(ns, val){
      ns = lab.joinNs(this.ns, ns);
      //target ns data must be array
      var target = this.get(ns, []);
      if(Array.isArray(target)){
        if(!target.length){
          //empty array, might need to init it
          target.push(val);
          this.set(ns, target);
        } else {
          target.push(val);
          this.binder.dispatch(ns, 'set', [this]);
        }
      }
      return this;
    }
    this.clear = function(ns){
      ns = lab.joinNs(this.ns, ns);
      lab.clear(ns, this.data);
      this.binder.dispatch(ns, 'clear', [this]);
      return this;
    }
    this.has = function(ns){
      ns = lab.joinNs(this.ns, ns);
      return lab.has(ns, this.data);
    }
    this.bind = function(ns, action, cb, waitForToken){
      ns = lab.joinNs(this.ns, ns);
      return lab.bind(ns, action, cb, waitForToken, this.binder);
    }
    this.unbind = function(token){
      return this.binder.unbind(token);
    }
    this.link = function(ns){
      ns = lab.joinNs(this.ns, ns);
      var linkLab = new LAB(ns.join('.'), this.data, this.binder);
      return linkLab;
    }
    this.getVal = function(){
      if(!this.ns) return this.data;
      return lab.get(this.ns, this.data, null);  
    }
    this.setVal = function(val){
     return this.set('', val);
    }

    return this;
  }

  function LABBinderToken(ns, cb, waitForToken){
    this.cb = cb;
    this.ns = Array.isArray(ns)?ns.join('.'):ns;
    this.waitForToken = waitForToken;
    this.tokenId = lab.getTokenId('lab');
    this.binderRef = {};
    this.getToken = function(){
      return this.tokenId;
    }
    this.match = function(ns){
      var regStr = Array.isArray(this.ns)?this.ns.join('.'):this.ns;
      regStr = regStr.replace(/\./g, '\\.').replace(/\*/g, '\\.*')
      var searchStr = Array.isArray(ns)?ns.join('.'):ns;
      var reg = new RegExp(regStr, 'i');
      return (searchStr.match(reg) || (searchStr + '.').match(reg))?true:false;
    }
    //keep track binders point for unbind purpose
    this.setBinderRef = function(action){
      this.binderRef.action = action;
    }
    this.getBinderRef = function(){
      return this.binderRef;
    }
    return this;
  }

  function LABBinder(){
    this.binders = {'get':{}, 'set':{}, 'clear':{}};
    this.bind = function(ns, action, cb, waitForToken){
      if(this.binders[action]){
        var token = new LABBinderToken(ns, cb, waitForToken)
        this.binders[action][token.getToken()] = token;
        token.setBinderRef(action);
        return token;
      }
      return null;
    }
    this.unbind = function(token){
      if(token){
        var binderRef = token.getBinderRef();
        if(this.binders[binderRef.action] && this.binders[binderRef.action][token.getToken()]){
          delete this.binders[binderRef.action][token.getToken()];
        }
      }
    }
    this.dispatch = function(ns, action, args){
      //find the binded token
      if(this.binders[action]){
        var tokens = this.binders[action];
        var bindedTokenIds = Object.getOwnPropertyNames(tokens).filter(function(tokenId){
          return tokens[tokenId].match(ns);
        });
        bindedTokenIds.forEach(function(tokenId){
          if(tokens[tokenId] && tokens[tokenId].cb){
            tokens[tokenId].cb.apply(tokens[tokenId], args);
          }
        })
      }
    }
  }

  var lab = {
    currToken : 0,
    init: function(data){
      return new LAB('', data);
    },
    get: function(ns, data, defVal){
      var levels = lab.parseNs(ns);
      if(levels.length) {
        for(var i = 0; i < levels.length - 1; i++){
          data = data[levels[i]]?data[levels[i]]:{};
          if(data instanceof LAB) {
            var subNs = levels.slice( i + 1 );
            return data.get(subNs, defVal);
          }
        }
        var ref = levels[levels.length - 1];
        return data[ref]?data[ref]:defVal;
      }
      return defVal;
    },
    set: function(ns, data, val){
      var levels = lab.parseNs(ns);
      if(levels.length) {
        for(var i = 0; i < levels.length - 1; i++){
          if(!data[levels[i]]){
            data[levels[i]] = {};
          }
          data = data[levels[i]];
          if(data instanceof LAB) {
            var subNs = levels.slice( i + 1 );
            return data.set(subNs, val);
          }
        }        
        var ref = levels[levels.length - 1];
        data[ref] = val;
      }
    },
    clear: function(ns, data){
      var levels = lab.parseNs(ns);
      if(levels.length) {
        for(var i = 0; i < levels.length - 1; i++){
          if(!data[levels[i]]){
            data[levels[i]] = {};
          }
          data = data[levels[i]];
          if(data instanceof LAB) {
            var subNs = levels.slice( i + 1 );
            return data.clear(subNs);
          }
        }        
        var ref = levels[levels.length - 1];
        delete data[ref];
      }
    },
    has: function(ns, data){
      var levels = lab.parseNs(ns);
      if(levels.length) {
        for(var i = 0; i < levels.length; i++){
          if(typeof data[levels[i]] === 'undefined'){
            return false;
          }
          data = data[levels[i]];
          if(data instanceof LAB) {
            var subNs = levels.slice( i + 1 );
            return data.has(subNs);
          }
        }
        return true;
      }
      return defVal;      
    },
    bind: function(ns, action, cb, waitForToken, binder){
      return binder.bind(ns, action, cb, waitForToken);
    },
    joinNs: function(baseNs, ns){
      var join = [];
      baseNs = lab.parseNs(baseNs);
      ns = lab.parseNs(ns);
      Array.prototype.push.apply(join, baseNs);
      Array.prototype.push.apply(join, ns);
      return join;
    },
    parseNs: function(ns){
      if(Array.isArray(ns)){
        return ns;
      } else if (typeof ns === 'string' && ns !== '') {
        return ns.split('.');
      } else if(typeof ns === 'number'){
        return [ns];
      } else {
        return [];
      }
    },
    getTokenId: function(prefix){
      ++lab.currToken;
      return prefix?prefix + '_' + lab.currToken:lab.currToken;
    }
  };


  return lab;

});