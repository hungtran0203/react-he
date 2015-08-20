/** @jsx React.DOM */

define(['react', 'lodash', 'jquery', 'hammerjs', 'he-libs/utils', 'he-libs/mixins'], function(React, _, $, Hammer, utils) {

var HEUI = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common],
  render: function() {
    return '';
  }

});

///////////////////////////////////// Component.Dropdown /////////////////////////////////////////
HEUI.Dropdown = React.createClass({
  mixins: [HE.UI.mixins.common, HE.UI.mixins.responsive],
  componentDidMount: function () {
    var $labelDOM = $(React.findDOMNode(this.refs.label));
    var $contentDOM = $(React.findDOMNode(this.refs.content));
    var self = this;
    //bind events
    $labelDOM.on('click', function(e){
      e.preventDefault();
      self.toggleDisplay();
    })
    if(this.getData('hover', null)){
      $labelDOM.on('mouseenter', function(e){
        self.displayContent();
      })
    }
    if(this.getData('auto-close', null) || this.getData('hover', null)){
      var hasFocus = false;
      $labelDOM.on('mouseenter', function(e){
        hasFocus = true;
      })
      $contentDOM.on('mouseenter', function(e){
        hasFocus = true;
      })
      $labelDOM.on('mouseleave', function(e){
        hasFocus = false;
        setTimeout(function(){
          if(!hasFocus){
            self.closeContent();
          }
        }, 100)
      })
      $contentDOM.on('mouseleave', function(e){
        hasFocus = false;
        setTimeout(function(){
          if(!hasFocus){
            self.closeContent();
          }
        }, 100)
      })      
    }
  },
  closeContent: function(){
    var $contentDOM = $(React.findDOMNode(this.refs.content));
    $contentDOM.removeClass('open');
  },
  displayContent: function(){
    var $contentDOM = $(React.findDOMNode(this.refs.content));
    $contentDOM.addClass('open');
    this.updateContentStatus();
  },
  toggleDisplay: function(){
    var $contentDOM = $(React.findDOMNode(this.refs.content));
    $contentDOM.toggleClass('open');
    this.updateContentStatus();
  },
  updateContentStatus: function(){
    var $labelDOM = $(React.findDOMNode(this.refs.label));
    var $contentDOM = $(React.findDOMNode(this.refs.content));
    var $wrapperDOM = $(React.findDOMNode(this.refs.wrapper));
    if($contentDOM.hasClass('open')) {
      $wrapperDOM.trigger('show.he.dropdown');
      //calculate position
      var offset = $labelDOM.offset();
      var posY = offset.top - $(window).scrollTop();
      var posX = offset.left - $(window).scrollLeft(); 
      var screenWidth = $(window).width();
      var left = $labelDOM.position().left;
      var diffX = posX - left;
      if($contentDOM.hasClass('right')){
        left = left + $labelDOM.width() - $contentDOM.width();
      }
      if($contentDOM.hasClass('center')){
        left = left - (($contentDOM.width() - $labelDOM.width()) / 2); 
      }
      var newPosX = left + diffX;
      if(newPosX < 0) {
        //not possible to put center/right, revert to left
        newPosX = posX;
        left = $labelDOM.position().left;
        $contentDOM.removeClass('right center');
      }
      if((newPosX + $contentDOM.width()) >= screenWidth) {
        //consider align right if possible
        if(newPosX + $labelDOM.width() - $contentDOM.width() > 0){
          $contentDOM.addClass('right');
          left = left + $labelDOM.width() - $contentDOM.width();
        } else {
          $contentDOM.addClass('center');
          left = posX + $labelDOM.width() - $contentDOM.width();
        }
      }

      $contentDOM.css('left', left + 'px');
      $wrapperDOM.trigger('shown.he.dropdown');
    }
  },
  getLabel: function(){
    return _.first(this.props.children);
  },
  getContent: function(){
    return _.last(this.props.children);
  },
  getContentStyle: function(){
    return {};
  },
  render: function(){
    var label = this.getLabel();
    var content = this.getContent();
    return <div className="he-dropdown-wrapper" ref="wrapper">
            {React.cloneElement(label, { ref: 'label' })}
            <div className={this.getClass('he-dropdown')} style={this.getContentStyle()} ref="content">
              {content}
            </div>
          </div>
          ;
  }
});
///////////////////////////////////// Component.Dropdown /////////////////////////////////////////

///////////////////////////////////// Component.LazyContent /////////////////////////////////////////
HEUI.LazyContent = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common, HE.UI.mixins.responsive],
  propTypes: {
    'data-lazyload-mounted': React.PropTypes.func
  },
  componentDidMount: function(){
    //assign lazy items
    this.lazyloadLab = this.props['data-lab'];
    var ui = this;
    this.props['data-lazyload-mounted'](ui)
  },
  loadLazyItems: function(){
    //trigger lazy load process
    return this.lazyloadLab?this.lazyloadLab.getVal():null;
  },
  getItems: function(){
    return this.lazyloadLab?this.lazyloadLab.quite().getVal():null;
  },
  isLoadFailed: function(){
    //check if failed on load items
    if(this.lazyloadLab !== undefined){
      var paging = this.lazyloadLab.getPaging('');
      return paging !== undefined && paging.hasStatus('failed')
    } else {
      return false;
    }
  },
  getErrorMessage: function(){
    if(this.lazyloadLab !== undefined){
      var paging = this.lazyloadLab.getPaging('');
      if(paging !== undefined) {
        return paging.errMsg;
      }
    }
    return '';
  },
  isLoaded: function(){
    //check if this component was triggered to load
    return (this.getItems() !== null);
  },
  hasNext: function(){
    //check if this component has next items to load
    if(this.lazyloadLab !== undefined){
      var paging = this.lazyloadLab.getPaging('');
      return (paging !== undefined && paging.getData('next'))
    } else {
      return false;
    }
  },
  loadNext: function(){
    //trigger loading next items
    if(this.hasNext()){
      var paging = this.lazyloadLab.getPaging('');
      if(paging.hasStatus('failed')){
        this.setState({'rerender':true});
        return;
      }
      if(paging.hasNext()){
        paging.setStatus('next');
      }
      this.loadLazyItems();
    }
  },
  hasPrevious: function(){
    //check if this component has previous items to load
    if(this.lazyloadLab !== undefined){
      var paging = this.lazyloadLab.getPaging('');
      return (paging !== undefined && paging.getData('previous'))
    } else {
      return false;
    }    
  },
  loadPrevious: function(){
    //trigger loading previous items
    if(this.hasPrevious()){
      var paging = this.lazyloadLab.getPaging('');
      if(paging.hasStatus('failed')){
        this.setState({'rerender':true});
        return;
      }
      if(paging.hasPrevious()){
        paging.setStatus('previous');
      }
      this.loadLazyItems();
    }
  },
  render: function(){
    var items = this.getItems();
    var self = this;
    return <div className="he-lazy-content" ref="content">
            {this.props.children.map(function(child){
              if(child.props['data-iterator'] && $.isFunction(child.props['data-iterator'])){
                return child.props['data-iterator'].apply(self, [items, self]);
              } else {
                return child;
              }
            })
            }
          </div>
          ;
  }
});
///////////////////////////////////// Component.LazyContent /////////////////////////////////////////

///////////////////////////////////// Component.OnDisplay /////////////////////////////////////////
HEUI.OnDisplay = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common, HE.UI.mixins.responsive],
  propTypes: {
    'data-delta': React.PropTypes.number,
    'data-on-display': React.PropTypes.func
  },
  componentDidMount: function(){
    var $this = $(React.findDOMNode(this));
    var delta = this.props['data-delta'];
    var ui = this;
    var handleDisplay = function(e){
      if(utils.isElementInViewport($this, delta)){
        ui.props['data-ondisplay'](e, ui);
      }
    }

    $(document).on('shown.he.dropdown', handleDisplay);
    $(document).on('scroll', handleDisplay);
  },
  render: function(){
    return <div className="he-ondisplay">
            {
              this.props.children
            }
          </div>
          ;
  }
});
///////////////////////////////////// Component.OnDisplay /////////////////////////////////////////


HE.UI.setInstance('Component', HEUI);
return HEUI;

}); //define
