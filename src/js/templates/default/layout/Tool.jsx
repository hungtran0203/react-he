/** @jsx React.DOM */

define(['react', 'jquery', 'he-template/ui/Form', 'he-template/ui/User'], function(React, $) {

var ToolLayout = React.createClass({
	userDropdownIterator: function(items, ui){
		if(!items) return '';
		if(Array.isArray(items)){
			if(items.length === 0){
				return 'No users found';
			}
			return items.map(function(item, index){
				return (<div key={index}>
								{item.name}
							</div>
						)
			})			
		} else {
			return 'Invalid data';
		}
	},
	getPreviousLoadingIcon: function(items, ui){
		var lab = ui.props['data-lab']
		var paging = lab.getPaging('');
		if(paging !== undefined && paging.getData('previous')){
			// paging.setStatus('previous');
			// ui.getLazyItems();
			// return <div key="load_previous"> Loading ... </div>;
		} else {
			return '';
		}
	},
	getNextLoadingIcon: function(items, ui){
		var lab = ui.props['data-lab']
		var paging = lab.getPaging('');
		var handleOnDisplay = function(e){
			if(paging){
				paging.setStatus('next');
			}
			ui.getLazyItems()
		}
		if(items === null || (paging !== undefined && paging.getData('next'))){
			return <HE.UI.Component.OnDisplay key="load_next" data-ondisplay={handleOnDisplay}> Loading ... </HE.UI.Component.OnDisplay>;
		} else {
			return '';
		}
	},
	handleLazyload: function(ui){
  //   var members = store.link('members')
		// var $dropdown = $(React.findDOMNode(this));
		// $dropdown.on('shown.he.dropdown', function(){
		// 	ui.getLazyItems();
		// })
	},
  render: function() {
      var users = store.link('users');
      var members = store.link('members')
      return (<div className="okie" ref='h'>
	      <HE.UI.Component.Dropdown ref='abcd'>
	        <a href="#" ref="list">
	          xasdasd
	          <span className="caret"></span>
	        </a>
	        <HE.UI.Component.LazyContent data-lab={members} data-bind-lazyload={this.handleLazyload}>
            <div data-iterator={this.getPreviousLoadingIcon}></div>
	        	<div data-iterator={this.userDropdownIterator}></div>
            <div data-iterator={this.getNextLoadingIcon}></div>
	        </HE.UI.Component.LazyContent>
	      </HE.UI.Component.Dropdown>
      </div>
    );
  }

}); //CommentForm

return ToolLayout;

}); //define
