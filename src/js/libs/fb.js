define(['facebook', 'he-libs/utils'], function(fb, utils){
  FB.init({
    appId				: '788741984571936',
		status 			: true, // check login status
		cookie 			: true, // enable cookies to allow the server to access the session
		xfbml  			: true,  // parse XFBML
    version			: 'v2.3'
  });
	
	FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
	function statusChangeCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
    } else if (response.status === 'not_authorized') {
    	utils.FB.displayLogin();
    } else {

    }
  }

  var FBLib = {};
  function FBLabBinder(params){
  	this.params = params;
  	this.done = false;
  	this.retry = 5;
  	var self = this;
  	this.dispatcher = function(){
  		var endpoint = self.getParam('endpoint', null)
  		var method = self.getParam('method', 'get');
  		var respCb = self.getParam('response', null);
  		var mapping = self.getParam('mapping', {});
  		var lab = self.getParam('lab', null);

  		if(lab !== null && endpoint){
  			//assign default get cb
  			if(respCb === null && method === 'get' && mapping){
  				//default  get response
  				respCb = function(res){
  					var keys = Object.keys(mapping);
  					keys.forEach(function(src){
  						var dst = mapping[src];
  						if(dst !== '' && res[dst] !== undefined){
  							lab.set(src, res[dst])
  						}
  					})
  					if(res['error']){
  						self.retry --;
  						if(self.retry < 0) {
  							self.done = true;
  						}
  					} else {
	  					self.done = true;
  					}
  				}
  			}
  			if(respCb !== null && !self.done){
			  	FB.api(endpoint, respCb);
  			}
  		}
  	}

  	this.getParam = function(name, def){
  		return (self.params && self.params[name] !== undefined)?self.params[name]:def;
  	}
  	return this;
  };

  FBLib.getLabBinder = function(params){
  	var binder = new FBLabBinder(params);
  	return binder.dispatcher;
  };

  FBLib.bindLabGet = function(lab, ns, params){
  	if(!params) return;
  	params['lab'] = lab;
  	if(!params['mapping'] && params['data']){
  		params['mapping'] = {};
  		params['mapping'][ns] = params['data'];
  	}
  	params['method'] = 'get';
  	lab.bind(ns, 'get', FBLib.getLabBinder(params))
  };

  FBLib.bindLabSet = function(lab, ns, params){

  };

  FBLib.bindLabClear = function(lab, ns, params){

  };

  FBLib.labBinder = function(){
  	FB.api('2204685680/members', function(res){
  		console.log(res);
  		if(res && res.data) {
  			store.set('lists', res.data)
  		}
  	});
  }
  return FBLib;
});