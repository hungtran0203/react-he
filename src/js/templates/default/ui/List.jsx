/** @jsx React.DOM */

define(['react', 'lodash', 'hammerjs', 'app/utils', 'app/mixins'], function(React, _, Hammer, utils) {

var HEUI = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common],
  render: function() {
    return '';
  }

}); //CommentForm

///////////////////////////////////// List.Slider /////////////////////////////////////////
HEUI.Slider = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common, HE.UI.mixins.responsive],
  componentDidUpdate: function(){
    this.updateStyles();
  },
  componentDidMount: function () {
    this.updateStyles();
    var self = this;
    var thisElement = React.findDOMNode(this);
    var interval = parseInt(this.getResponsiveData('autoplay', ''));
    if(interval > 500){ //minium auto play interval
      this.autoPlay(interval);
      thisElement.addEventListener('mouseover', function(){self.pauseAutoPlay(5)});
    }
    var trackElement = React.findDOMNode(this.refs.track);
    //bind hammerjs events
    this.enablePan(thisElement, trackElement);
    this.enableSwipe(thisElement, trackElement, {baseDistance: this.getItemWidth()});

    //bind zoom action
    this.enableZoom(thisElement, trackElement);
  },
  enableZoom: function(element, target){
    var self = this;
    if(self.getZoomOptions().length > 1) {
      element.addEventListener('mousedown', function(e){
        if(e.ctrlKey) { //click with control button
          self.changeZoomLevel()
        }
      });
      var hammer = new Hammer.Manager(element);
      hammer.get('pinch').set({enable: true})
      hammer.on('pinchin', function(){
        self.changeZoomLevel(-1);
      })
      hammer.on('pinchout', function(){
        self.changeZoomLevel(1);
      })
    }    
  },
  enablePan: function(element, target){
    var hammer = new Hammer(element);
    var self = this;
    var oldTransion = target.style.transition;
    target = target?target:element;
    var newPos;
    hammer.on('panleft', function(e){
      target.style.transition = 'none';
      newPos = parseInt(target.style.left) - 10;
      var minPos = self.getMinPos();
      if(newPos < minPos) {
        newPos = minPos + 10;
      }
      target.style.left =  newPos + 'px';
    })
    hammer.on('panright', function(e){
      target.style.transition = 'none';
      newPos = parseInt(target.style.left) + 10;
      var maxPos = self.getMaxPos();
      if(newPos > maxPos) {
        newPos = maxPos - 10;
      }
      target.style.left = newPos + 'px';
    })
    hammer.on('panend', function(e){
      // self.slideTo(newPos);
      self.setCurrentSlidePos(newPos);
    })
  },
  enableSwipe: function(element, target, options){
    options = _.merge({baseDistance: 1200, velocity: 0.65}, options);
    var hammer = new Hammer(element);
    var self = this;
    var oldTransion = target.style.transition;
    target = target?target:element;
    var newPos;
    hammer.on('swipeleft', function(e){
      newPos = self.getCurrentSlidePos() - parseInt(options.baseDistance * e.velocityX / options.velocity);
      var minPos = self.getMinPos();
      if(newPos < minPos) {
        newPos = minPos + 10;
      }
      target.style.left =  newPos + 'px';
      setTimeout(function(){self.slideTo(newPos)}, self.getResponsiveData('speed', 500));
    })
    hammer.on('swiperight', function(e){
      newPos = self.getCurrentSlidePos() - parseInt(options.baseDistance * e.velocityX / options.velocity);
      var maxPos = self.getMaxPos();
      if(newPos > maxPos) {
        newPos = maxPos - 10;
      }
      target.style.left = newPos + 'px';
      setTimeout(function(){self.slideTo(newPos)}, self.getResponsiveData('speed', 500));
    })
  },
  autoPlay: function(interval){
    var self = this;
    setTimeout(function(){
      if(!self.autoPlayCountDown){
        self.slide(1);
      } else {
        self.autoPlayCountDown = parseInt(self.autoPlayCountDown) - 1;
      }
      self.autoPlay(interval);
    }, parseInt(interval))
  },
  pauseAutoPlay: function(times){
    this.autoPlayCountDown = times?times:15;;
  },
  updateStyles: function () {
    var itemList = React.findDOMNode(this.refs.itemList);
    var track = React.findDOMNode(this.refs.track);
    var width = itemList.offsetWidth;
    //recalculate width after mounted;
    var itemWidth = this.getItemWidth();
    var items = track.children;
    track.style.width = itemWidth * items.length + 2 * this.getSlidePadding() + 'px'; //item padding?
    for(var i = 0; i < items.length; i ++){
      items[i].style.width = itemWidth + 'px';
    }
    track.style.left = this.getCurrentSlidePos() + 'px';
    track.style.transition =  this.getSlideTransition();
    this.updateNavigateStyle();
  },
  updateNavigateStyle: function(){
    if(this.canSlide(-1)){
      React.findDOMNode(this.refs.rightNav).style.display = 'block';
    } else {
      React.findDOMNode(this.refs.rightNav).style.display = 'none';      
    }
    if(this.canSlide(1)){
      React.findDOMNode(this.refs.leftNav).style.display = 'block';
    } else {
      React.findDOMNode(this.refs.leftNav).style.display = 'none';      
    }
  },
  getItemWidth: function(){
    var itemList = React.findDOMNode(this.refs.itemList);
    var track = React.findDOMNode(this.refs.track);
    var width = itemList.offsetWidth;
    //slide padding
    width = width - 2 * this.getSlidePadding();
    //recalculate width after mounted;
    return width / this.getSlidesToShow();
  },
  getSlidePadding: function(){
    var slidePadding = this.getResponsiveData('slide-padding', 1);
    return (slidePadding > 5)?slidePadding:0;
  },
  getZoomLevel: function(def){
    var zoomLevel = parseInt(this.zoomLevel?this.zoomLevel:this.getData('zoom-level', def));
    return zoomLevel>0?zoomLevel:1;
  },
  setZoomLevel: function(level){
    this.zoomLevel = level;
  },
  getZoomOptions: function(){
    return [1, 2, 3];
  },
  changeZoomLevel: function(step){
    var zoomOptions = this.getZoomOptions();
    var currentZoom = this.getZoomLevel();
    var index = utils.getMinDiffArrayItem(zoomOptions, currentZoom, 1);
    var nextZoomIndex;
    if(step !== undefined){
      nextZoomIndex = Math.min(Math.max(0, index + step), zoomOptions.length - 1);
    } else {
      nextZoomIndex = ++index % zoomOptions.length;
    }
    this.setZoomLevel(zoomOptions[nextZoomIndex]);
    this.setState({'rendering': true})
  },
  getSlidesToShow: function(){
    //slide to show depend on zoom level
    return this.getResponsiveData('slides-to-show', 1) * this.getZoomLevel(1);
  },
  getSlidesToScroll: function(){
    return parseInt(this.getData('slides-to-scroll', 1));
  },
  isInfinite: function(){
    return this.getData('infinite', 1) !== false;
  },
  handleNavigateClick: function(event){
    if(event.target.dataset.direction){
      var direction = (event.target.dataset.direction < 0)?-1:1;
      this.slide(direction);
    }
    this.updateNavigateStyle();
    //pause autoplay if exist
    this.pauseAutoPlay();
  },
  slide: function(direction) {
    var step = this.getSlidesToScroll();
    var itemWidth = this.getItemWidth();
    var distance = (-1 * direction * step * itemWidth);
    this.slideDistance(distance);
  },
  slideDistance: function(distance){
    var currSlidePos = this.getCurrentSlidePos();
    var itemWidth = this.getItemWidth();
    var slidesToScroll = Math.round(distance / itemWidth);
    var distanceToSlide = slidesToScroll * itemWidth;
    var newSlidePos = currSlidePos + distanceToSlide;
    var minPos = this.getMinPos();
    var maxPos = this.getMaxPos();
    var track = React.findDOMNode(this.refs.track);
    //padding adjustment
    var slidePadding = this.getSlidePadding();
    if(slidePadding){
      if(currSlidePos === this.getMaxPos()) {
        newSlidePos = newSlidePos + slidePadding;
      } else if (currSlidePos === this.getMinPos()){
        newSlidePos = newSlidePos - slidePadding;
      }
    }

    if(newSlidePos > maxPos) {
      track.style.transition = 'none';
      track.style.left = minPos + 'px';
      var self = this;
      newSlidePos = newSlidePos - (maxPos - minPos);        
      setTimeout(function(){
        track.style.transition = self.getSlideTransition();
        track.style.left = newSlidePos + 'px';
      }, 50);
    } else if (newSlidePos < minPos) {
      newSlidePos = newSlidePos + (maxPos - minPos);
      track.style.transition = 'none';
      track.style.left = maxPos + 'px';
      var self = this;
      setTimeout(function(){
        track.style.transition = self.getSlideTransition();
        track.style.left = newSlidePos + 'px';
      }, 50);
    } else {
      track.style.left = newSlidePos + 'px';
    }
    this.setCurrentSlidePos(newSlidePos);
  },
  slideTo: function(newPos){
    var track = React.findDOMNode(this.refs.track);
    this.slideDistance(newPos - this.getCurrentSlidePos());
    track.style.transition = this.getSlideTransition();
  },
  getMinPos: function(){
    var itemWidth = this.getItemWidth();
    return (this.refs.track.props.children.length - this.getSlidesToShow()) * itemWidth * -1;
  },
  getMaxPos: function(){
    return 0;
  },
  canSlide: function(direction){
    if(this.isInfinite()){
      return true;
    }
    var currSlidePos = this.getCurrentSlidePos();
    switch(direction) {
      case -1:
        return !(currSlidePos >= 0);
        break;
      case 1:
        var itemWidth = this.getItemWidth();
        var itemsToShow = this.getSlidesToShow();
        var totalItems = this.refs.track.props.children.length;
        return ((totalItems - itemsToShow) * itemWidth + currSlidePos) > 0;
        break;
    }
    return true;
  },
  getCurrentSlidePos: function(){
    var defPos = 0;
    if(typeof this.currSlidePos === 'undefined'){
      //initialize current pos
      if(this.isMounted()){
        var activeIndex = this.getData('active-index', 0);
        if(activeIndex && this.props.children.length) {
          var itemWidth = this.getItemWidth();
          defPos = -1 * (this.getSlidesToShow() + parseInt(activeIndex)) * itemWidth;
        }
        var slidePadding = this.getSlidePadding();
        if(slidePadding){
          if(defPos !== this.getMaxPos()){
            defPos += slidePadding;
          }
          if(defPos === this.getMinPos()){
            defPos += (2 * slidePadding);
          }
        }
      }
      return defPos;
    } else {
      return this.currSlidePos;
    }
  },
  setCurrentSlidePos: function(pos){
    this.currSlidePos = pos;
  },
  prepareSlides: function(){
    var items = [];
    var slides = this.props.children;
    //slice the slides base on zoom level
    var zoomLevel = this.getZoomLevel();
    if(zoomLevel > 1) {
      slides = _.chunk(slides, zoomLevel);
    }
    if(this.isInfinite() && slides.length){
      items = items.concat(slides.slice((0 - this.getSlidesToShow())), slides);
    } else {
      items = slides;
    }
    return items;
  },
  getSlideTransition: function(){
    return 'left ' + this.getResponsiveData('speed', 500) + 'ms';
  },
  render: function(){
    var items = this.prepareSlides();
    var self = this;
    var trackStyle = {position: 'relative', display:'block', opacity: '1'};
    var itemListStyle = {'overflow': 'hidden', 'position': 'relative'};
    var leftStyle = {position: 'absolute', left: '-20px', 'fontSize': '0px', width: '20px', height: '20px', top: '50%', marginTop: '-10px'};
    var rightStyle = {position: 'absolute', right: '-20px', 'fontSize': '0px', width: '20px', height: '20px', top: '50%', marginTop: '-10px'};
    var itemStyle = {width: '1px', float: 'left', padding: this.getData('style-padding', '5px 10px')};
    return <div className={this.getClass('he-list-slider-wrapper')} style={{position: 'relative'}}>
            <div className="he-list-slider-itemlist" style={itemListStyle} ref="itemList">
              <div className="he-list-slider-track" style={trackStyle} ref="track">
               {
                items.map(function(item, id){
                  if(Array.isArray(item)){
                    return <div key={id} style={itemStyle} className="he-list-slider-item">
                            {
                              item.map(function(subItem, subId){
                                return <div key={id + '_' + subId} >{subItem}</div>
                              })
                            }
                          </div>;

                  } else {
                    return <div key={id} style={itemStyle} className="he-list-slider-item">{item}</div>;
                  }
                })
                }
              </div>
            </div>
            <div className="he-list-slider-nav-left">
              <button title="left" style={leftStyle} onClick={this.handleNavigateClick} data-direction="-1" ref="leftNav">Left</button>
            </div>
            <div className="he-list-slider-nav-right">
              <button title="right" style={rightStyle} onClick={this.handleNavigateClick} data-direction="1" ref="rightNav">Right</button>
            </div>
            <div className="he-list-slider-thumb">
            </div>
          </div>
  }
})
///////////////////////////////////// List.Slider /////////////////////////////////////////


HE.UI.setInstance('List', HEUI);
return HEUI;

}); //define
