define(['react'], function (React) {
  'use strict';

  var mixins = {
  	init: function(){
  		window.HE.UI.setMixin('lab', this.labMixins)
  		window.HE.UI.setMixin('common', this.commonMixins)
  		window.HE.UI.setMixin('input', this.inputMixins)
  		window.HE.UI.setMixin('user', this.userMixins)
  		window.HE.UI.setMixin('responsive', this.responsiveMixins)
  	},
  	responsiveMixins: {
		  getInitialState: function() {
		    var ui = this;
		    window.addEventListener('resize', function(event){
		      if(ui.isMounted){
		        ui.setState({'resizing': true});
		      }
		    })
		  	return {};
		  },
		  getColumnNum: function(){
		  	return this.getResponsiveData('col', 1);
		  },
		  getResponsiveData: function(dataName, def){
		  	var data = this.getData(dataName);
		  	var size = parseInt(data);
		  	if(!isNaN(size)) return size;
		    size = this.detectDisplaySize(data, def);
		    return parseInt(size);
		  },
		  detectDisplayMode: function(){
		    //support 5 modes: xxs, xs, sm, md, lg
		    var mode = 4;
		    var actualWidth = window.innerWidth ||
		                      document.documentElement.clientWidth ||
		                      document.body.clientWidth ||
		                      document.body.offsetWidth;
		    if(actualWidth >= 1200){
		      mode = 4;
		    } else if(actualWidth >= 992) {
		      mode = 3;
		    } else if(actualWidth >= 768) {
		      mode = 2;
		    } else if(actualWidth >= 480) {
		      mode = 1;
		    } else {
		      mode = 0;
		    }
		    return mode;
		  },
		  detectDisplaySize: function(configStr, def) {
		    var size = def?def:1;
		    var mode = this.detectDisplayMode();
		    var modes = ['xxs', 'xs', 'sm', 'md', 'lg'];
		    var curr = 0;
		    if(configStr){
		      configStr = '' + configStr;
		      var config = configStr.split(' ');
		      for(var i = 0; i < config.length; i++){
		        var pair = config[i].split('-');
		        if(pair.length === 2 ) {
		          var check = modes.indexOf(pair[0]);
		          if(check === mode){
		            return pair[1];
		          }
		          if(check > -1 && check <= mode && check > curr){
		            curr = check;
		            size = pair[1];
		          }
		        }        
		      }
		    }
		    return size;
		  }
  	},
  	userMixins: {
		  getInitialState: function() {
		  	return {};
			},
			getDisplayName: function(){
				return this.props['data-lab'].get('firstname') + this.props['data-lab'].get('lastname');
			},
			getAvatarUrl: function(){
				return this.props['data-lab'].get('avatar.url');
			},
			getCoverUrl: function(){
				return this.props['data-lab'].get('cover.url');
			}
  	},
  	labMixins: {
		  getInitialState: function() {
		  	if(!this.labBinders) this.labBinders = [];
		    if(this.props['data-lab']){
		      var ui = this;
		      this.labBinders['set'] = this.props['data-lab'].bind('*', 'set', function(){
		      	if(ui.isMounted()){
			        ui.setState({'data-lab': ui.props['data-lab']});
		      	}
		      });
		      this.labBinders['clear'] = this.props['data-lab'].bind('*', 'clear', function(){
		      	if(ui.isMounted()){
			        ui.setState({'data-lab': ui.props['data-lab']});
			       }
		      });
		      return {'data-lab': this.props['data-lab']};
		    } else {
		      return {};
		    }
		  },
		  componentWillUnmount: function(){
		    if(this.props['data-lab'] && this.labBinders['set'] && this.labBinders['clear']){
			  	this.props['data-lab'].unbind(this.labBinders['set']);
			  	this.props['data-lab'].unbind(this.labBinders['clear']);
			  }
		  }
  	},
  	commonMixins: {
  		getClass: function(className){
			  var classes = {};
			  classes[className] = true;
			  if(this.props.class){
				  classes[this.props.class] = true;
			  }
			  if(this.props.className){
				  classes[this.props.className] = true;
			  }
			  return React.addons.classSet(classes);
  		},
  		hasTitle:  function(){
  			return this.props.title?true:false;
  		},
  		getTitle:  function(){
  			if(typeof this.props.title === 'object'){
  				return this.props.title.getVal();
  			}
  			return this.props.title;
  		},
  		getValue:  function(){
  			if(typeof this.props.value === 'object'){
  				return this.props.value.getVal();
  			}
  			return this.props.value;
  		},
  		setValue: function(val){
  			if(typeof this.props.value === 'object'){
  				return this.props.value.setVal(val);
  			}
  			else if(typeof this.props.value !== 'undefined') {
	  			this.props.value = val;
  			}
  		},
  		getData: function(name, def){
  			return (typeof this.props['data-' + name] !== 'undefined')?this.props['data-' + name]:def;
  		},
  		except: function(exceptedOpts){
  			return _.omit(this.props, exceptedOpts);
  		}
  	},
  	inputMixins: {
  		getValueLink: function(){
		    var ui = this;
		    var valueLink = {
		      value: ui.getValue(),
		      requestChange: function(newVal){ui.setValue(newVal)}
		    };
		    return valueLink;
  		}
  	}
  };

  mixins.init();


  return mixins;

});