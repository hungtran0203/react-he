define(['facebook', 'he-libs/utils', 'jquery', 'he-libs/lab'], function(fb, utils, $, LAB){
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
  	this.paging = LAB.getPagingInstance({next:null, previous:null, count:null});

  	this.seedPagingData = function(oldData, newData, fbPaging){
  		var paging = this.paging;
  		var lab = this.getParam('lab', null);
  		var seedData = oldData;
  		if(fbPaging && lab){
  			lab.setPaging('', paging)
  		}
  		if(fbPaging.next){
	  		var nextParams = utils.deparam(fbPaging.next);
	  		var limit = parseInt(nextParams.limit);
	  		var offset = parseInt(nextParams.offset) - limit;
	  		if(!paging.hasPage(offset, limit)){
		  		paging.addPage(offset, limit);
		  		paging.setData('next', fbPaging.next);
		  		seedData = oldData.concat(newData);
	  		}
  		} else {
  			paging.setData('next', null);
  		}
  		if(fbPaging.previous){
  			var previousParams = utils.deparam(fbPaging.previous);	
	  		var limit = parseInt(previousParams.limit);
	  		var offset = parseInt(previousParams.offset) + limit;
	  		if(!paging.hasPage(offset, limit)){
		  		paging.addPage(offset, limit);
		  		paging.setData('previous', fbPaging.previous);
		  		seedData = newData.concat(oldData);
	  		}
  		} else {
  			paging.setData('previous', null);
  		}
  		return seedData;
  	}

  	var self = this;
  	this.dispatcher = function(){
  		var endpoint = self.getParam('endpoint', null)
  		var method = self.getParam('method', 'get');
  		var respCb = self.getParam('response', null);
  		var mapping = self.getParam('mapping', {});
  		var lab = self.getParam('lab', null);
  		var fbParams = self.getParam('params', {});
  		if(lab !== null && endpoint){
  			//assign default get cb
  			if(respCb === null && method === 'get' && mapping){
  				//default get response
  				respCb = function(res){
  					if(res['error']){
  						self.retry --;
  						if(self.retry < 0) {
  							self.paging.setStatus('failed')
  						}
  					} else {
		 					var keys = Object.keys(mapping);
	  					keys.forEach(function(src){
	  						var dst = mapping[src];
	  						if(res[src] !== undefined){
	  							var val
	  							if(Array.isArray(res[src])){
										val = lab.quite().get(dst, []);
										if(res['paging']){
		  								val = self.seedPagingData(val, res[src], res['paging']);
										} else {
											val = res[src];
										}
	  							} else {
	  								val = res[src];
	  							}
	  							lab.set(dst, val)
	  						}
	  					})
	  					self.paging.setStatus('done');
  					}
  				}
  				self.setParam('response', respCb);
  			}
  			var status = self.paging.getStatus();
  			if(respCb !== null){
  				switch(status){
  					case 'next':
  						$.get(self.paging.getData('next'), respCb, 'json');
  						break;
  					case 'previous':
  						$.get(self.paging.getData('previous'), respCb, 'json');
  						break;
  					case 'ready':
  						FB.api(endpoint, fbParams, respCb);
  						break;
  				}
  			}
  		}
  	}

  	this.getParam = function(name, def){
  		return (self.params && self.params[name] !== undefined)?self.params[name]:def;
  	}
  	this.setParam = function(name, val){
  		if(self.params){
  			self.params[name] = val;
  		}
  		return self;
  	}
  	return this;
  };

  FBLib.getLabBinder = function(params){
  	var binder = new FBLabBinder(params);
  	return binder.dispatcher;
  };

  FBLib.bindLabGet = function(lab, ns, params){
  	if(!params) return;
  	params['lab'] = lab.link(ns);
  	if(params['mapping'] === undefined ){
  		params['mapping'] = {};
  	}
  	params['method'] = 'get';
  	lab.bind(ns, 'get', FBLib.getLabBinder(params))
  };

  FBLib.bindLabSet = function(lab, ns, params){

  };

  FBLib.bindLabClear = function(lab, ns, params){

  };
  
  window['HE']['FBLib'] = FBLib;
  return FBLib;
});