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
    //bind events
    $labelDOM.on('click', function(e){
      $contentDOM.toggleClass('open');
      e.preventDefault();
      //calculate position
      $contentDOM.css('left', '0px');
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
    return {};
  },
  render: function(){
    var label = this.getLabel();
    var content = this.getContent();
    return <div className={this.getClass('he-dropdown-wrapper')}>
            {React.cloneElement(label, { ref: 'label' })}
            <div className="he-dropdown" style={this.getContentStyle()} ref="content">
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
