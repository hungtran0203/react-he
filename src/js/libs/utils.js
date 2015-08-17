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

      if(!delta) delta = 0;
      var rect = el.getBoundingClientRect();

      //check for hidden
      if (rect.height == 0 && rect.width == 0) return false;

      return (
        rect.top >= (0 - delta) &&
          rect.left >= (0 - delta) &&
          (rect.bottom - delta) <= (window.innerHeight || document.documentElement.clientHeight) && /*or jQuery(window).height() */
          (rect.right - delta) <= (window.innerWidth || document.documentElement.clientWidth) /*or jQuery(window).width() */
        );
    }    
  };
  utils.init();

  return utils;

});