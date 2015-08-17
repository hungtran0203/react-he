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
    if($contentDOM.hasClass('open')) {
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
    return <div className="he-dropdown-wrapper">
            {React.cloneElement(label, { ref: 'label' })}
            <div className={this.getClass('he-dropdown')} style={this.getContentStyle()} ref="content">
              {content}
            </div>
          </div>
          ;
  }
});
///////////////////////////////////// Component.Dropdown /////////////////////////////////////////


HE.UI.setInstance('Component', HEUI);
return HEUI;

}); //define
