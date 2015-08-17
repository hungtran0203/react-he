/** @jsx React.DOM */

define(['react', 'he-template/ui/Form', 'he-template/ui/User'], function(React) {

var ToolLayout = React.createClass({
	userDropdownIterator: function(item){
		if(!item) return '';
		return (<div key={item.id}>
							{item.name}
						</div>
			)
	},
  render: function() {
      var users = store.link('users');
      var members = store.link('members')
      return (<div>
	      <HE.UI.Component.Dropdown data-hover="1">
	        <a href="#">
	          xasdasd
	          <span className="caret"></span>
	        </a>
	        <HE.UI.Component.LazyContent data-lab={members}>
	        	<div data-iterator={this.userDropdownIterator}>
            </div>
	        </HE.UI.Component.LazyContent>
	      </HE.UI.Component.Dropdown>
      </div>
    );
  }

}); //CommentForm

return ToolLayout;

}); //define
