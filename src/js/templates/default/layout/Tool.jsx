/** @jsx React.DOM */

define(['react', 'template/ui/Form', 'template/ui/User'], function(React) {

var ToolLayout = React.createClass({
  render: function() {
      var users = store.link('users');
      return (
      <HE.UI.User.List.Slider className="family" data-lab={users}>
       
      </HE.UI.User.List.Slider>
    );
  }

}); //CommentForm

return ToolLayout;

}); //define