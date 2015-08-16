/** @jsx React.DOM */

define(['react', 'lodash', 'he-libs/utils', 'he-libs/mixins'], function(React, _) {

var HEUI = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common],
  render: function() {
    return '';
  }

}); //CommentForm

///////////////////////////////////// Grid.Columns /////////////////////////////////////////
HEUI.Columns = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common, HE.UI.mixins.responsive],
  getStyle: function(nColumn, index){
    return {width: ((100 / nColumn) + '%'), float: 'left', padding: this.getData('style-padding', '5px 10px')};
  },
  render: function(){
    var items = this.props.children;
    var nColumn = this.getColumnNum();
    var columns = new Array(nColumn);
    //split items
    for(var i = 0; i < columns.length; i++){
      columns[i] = items.filter(function(v, index){ return (index % nColumn === i); });
    }
    var self = this;
    if(items){
      return <div className={this.getClass('he-grid-columns-wrapper')}>
        {
          columns.map(function(columnItems, index){
            return <div key={index} style={self.getStyle(nColumn)} className={self.getClass('he-grid-columns')}>
                    {columnItems}
                  </div>;
          })
        }
      </div>;
    } else {
      return '';
    }
  }
})
///////////////////////////////////// Grid.Columns /////////////////////////////////////////

HE.UI.setInstance('Grid', HEUI);
return HEUI;

}); //define
