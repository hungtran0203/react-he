define(['react', 'jquery'], function (React, $) {
  'use strict';

  var utils = {
    uuid: function () {
      /*jshint bitwise:false */
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
          .toString(16);
      }

      return uuid;
    },

    pluralize: function (count, word) {
      return count === 1 ? word : word + 's';
    },

    init: function(){
      //setup he namespace
      if(!window.HE) {
        window.HE = {
          UI: {
            setInstance: function(name, instance){
              if(name === 'mixins') return;
              if(!HE.UI[name]) {
                HE.UI[name] = instance;
              }
            },
            setMixin: function(name, mixin){
              if(!HE.UI.mixins){HE.UI.mixins = {};}
              if(!HE.UI.mixins[name]) {
                HE.UI.mixins[name] = mixin;
              }
            }
          },
          utils: utils
        };
      }
    },
    getMinDiffArrayItem: function(arr, find, returnType) {
      var foundIndex = 0;
      var found = arr[foundIndex];
      var minDiff = 0;
      arr.map(function(val, index){
        var diff = Math.abs(find - val);
        if(minDiff >= diff){
          minDiff = diff;
          found = val;
          foundIndex = index;
        }
      })
      return returnType?foundIndex:found;
    },
    loadCss: function(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl('he-styles/' + url);
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    FB: {
      api: function(){
        FB.api(
          "/me",
          function (response) {
            if (response && !response.error) {
              console.log('aaaaaaaaaaaaaaaaaaa')
            }
          }
        );
      },
      displayLogin: function(){
        React.render(
          React.createElement(HE.UI.User.OAuthLogin, {}),
          document.getElementById('fbLogin')
        );        
      }
    },
    isElementInViewport: function (el, delta) {
      if (el instanceof jQuery) {
        el = el[0];
      }

      var delta = parseInt(delta);
      delta = delta?delta:0;
      
      var rect = el.getBoundingClientRect();

      //check for hidden
      if (rect.height == 0 && rect.width == 0) return false;

      return (
        rect.top >= (0 - delta) &&
          rect.left >= (0 - delta) &&
          (rect.bottom - delta) <= (window.innerHeight || document.documentElement.clientHeight) && /*or jQuery(window).height() */
          (rect.right - delta) <= (window.innerWidth || document.documentElement.clientWidth) /*or jQuery(window).width() */
        );
    },
    
    deparam: function (params, coerce) {
      params = params.slice(params.indexOf('?') + 1);
      var obj = {},
          coerce_types = { 'true': !0, 'false': !1, 'null': null };
        
      // Iterate over all name=value pairs.
      $.each(params.replace(/\+/g, ' ').split('&'), function (j,v) {
        var param = v.split('='),
            key = decodeURIComponent(param[0]),
            val,
            cur = obj,
            i = 0,
              
            // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
            // into its component parts.
            keys = key.split(']['),
            keys_last = keys.length - 1;
          
        // If the first keys part contains [ and the last ends with ], then []
        // are correctly balanced.
        if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
          // Remove the trailing ] from the last keys part.
          keys[keys_last] = keys[keys_last].replace(/\]$/, '');
            
          // Split first keys part into two parts on the [ and add them back onto
          // the beginning of the keys array.
          keys = keys.shift().split('[').concat(keys);
            
          keys_last = keys.length - 1;
        } else {
          // Basic 'foo' style key.
          keys_last = 0;
        }
          
        // Are we dealing with a name=value pair, or just a name?
        if (param.length === 2) {
          val = decodeURIComponent(param[1]);
            
          // Coerce values.
          if (coerce) {
            val = val && !isNaN(val)              ? +val              // number
                : val === 'undefined'             ? undefined         // undefined
                : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
                : val;                                                // string
          }
            
          if ( keys_last ) {
            // Complex key, build deep object structure based on a few rules:
            // * The 'cur' pointer starts at the object top-level.
            // * [] = array push (n is set to array length), [n] = array if n is 
            //   numeric, otherwise object.
            // * If at the last keys part, set the value.
            // * For each keys part, if the current level is undefined create an
            //   object or array based on the type of the next keys part.
            // * Move the 'cur' pointer to the next level.
            // * Rinse & repeat.
            for (; i <= keys_last; i++) {
              key = keys[i] === '' ? cur.length : keys[i];
              cur = cur[key] = i < keys_last
                ? cur[key] || (keys[i+1] && isNaN(keys[i+1]) ? {} : [])
                : val;
            }
              
          } else {
            // Simple key, even simpler rules, since only scalars and shallow
            // arrays are allowed.
              
            if ($.isArray(obj[key])) {
              // val is already an array, so push on the next value.
              obj[key].push( val );
                
            } else if (obj[key] !== undefined) {
              // val isn't an array, but since a second value has been specified,
              // convert val into an array.
              obj[key] = [obj[key], val];
                
            } else {
              // val is a scalar.
              obj[key] = val;
            }
          }
            
        } else if (key) {
          // No value was defined, so set something meaningful.
          obj[key] = coerce
            ? undefined
            : '';
        }
      });
        
      return obj;
    }
  };
  utils.init();

  return utils;

});