/** @jsx React.DOM */

define(['react', 'he-template/ui/Form', 'he-template/ui/User'], function(React) {

var ToolLayout = React.createClass({
  render: function() {
      var users = store.link('users');
      var members = store.link('members')
      return (<div>
	      <HE.UI.Component.Dropdown data-hover="1">
	        <a href="#">
	          xasdasd
	          <span className="caret"></span>
	        </a>
	        <HE.UI.Component.LazyContent data-lab={store}>
	        </HE.UI.Component.LazyContent>
	      </HE.UI.Component.Dropdown>
      </div>
    );
  }

}); //CommentForm

return ToolLayout;

}); //define
