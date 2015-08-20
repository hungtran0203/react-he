/** @jsx React.DOM */

define(['react', 'jquery', 'he-template/ui/Form', 'he-template/ui/User'], function(React, $) {

var ToolLayout = React.createClass({
	userDropdownIterator: function(items, lazyloadUI){
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
	getPreviousLoadingUI: function(items, lazyloadUI){
		if(lazyloadUI.hasPrevious()){
			return <HE.UI.Component.OnDisplay key="load_previous" data-ondisplay={function(){lazyloadUI.loadPrevious();}}> Loading ... </HE.UI.Component.OnDisplay>;
		} else {
			return '';
		}
	},

	getNextLoadingUI: function(items, lazyloadUI){
		if(lazyloadUI.isLoadFailed()){
			return 'Load failed';
		} else if(!lazyloadUI.isLoaded()){
			return <HE.UI.Component.OnDisplay key="load_next" data-ondisplay={function(){lazyloadUI.loadLazyItems();}}> start loading... </HE.UI.Component.OnDisplay>;
		} else if(lazyloadUI.hasNext()){
			return <HE.UI.Component.OnDisplay key="load_next" data-ondisplay={function(){lazyloadUI.loadNext();}}> Loading ... </HE.UI.Component.OnDisplay>;
		} else {
			return '';
		}
	},
	lazyloadMounted: function(lazyloadUI){

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
	        <HE.UI.Component.LazyContent data-lab={members} data-lazyload-mounted={this.lazyloadMounted} ref="lazyloadUI">
            <div data-iterator={this.getPreviousLoadingUI}></div>
	        	<div data-iterator={this.userDropdownIterator}></div>
            <div data-iterator={this.getNextLoadingUI}></div>
	        </HE.UI.Component.LazyContent>
	      </HE.UI.Component.Dropdown>
      </div>
    );
  }

}); //CommentForm

return ToolLayout;

}); //define
