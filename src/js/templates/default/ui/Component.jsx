/** @jsx React.DOM */

define(['react', 'lodash', 'jquery', 'hammerjs', 'app/utils', 'app/mixins'], function(React, _, $, Hammer, utils) {

var HEUI = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common],
  render: function() {
    return '';
  }

});

///////////////////////////////////// Component.Popover /////////////////////////////////////////
HEUI.Popover = React.createClass({
  mixins: [HE.UI.mixins.common, HE.UI.mixins.responsive],
  componentDidMount: function () {
    var $labelDOM = $(React.findDOMNode(this.refs.label));
    var $contentDOM = $(React.findDOMNode(this.refs.content));
    //bind events
    $labelDOM.on('click', function(e){
      $contentDOM.toggleClass('he-hide');
      e.preventDefault();      
    })
  },
  getLabel: function(){
    return _.first(this.props.children);
  },
  getContent: function(){
    return _.last(this.props.children);
  },
  getLabelStyle: function(){

  },
  getContentStyle: function(){
    return {display:'none'};
  },
  render: function(){
    var label = this.getLabel();
    var content = this.getContent();
    return <div className={this.getClass('he-popover')}>
            {React.cloneElement(label, { ref: 'label' })}
            <div className="he-popover-content" style={this.getContentStyle()} ref="content">
              {content}
            </div>
          </div>
          ;
  }
});
///////////////////////////////////// Component.Popover /////////////////////////////////////////


HE.UI.setInstance('Component', HEUI);
return HEUI;

}); //define
