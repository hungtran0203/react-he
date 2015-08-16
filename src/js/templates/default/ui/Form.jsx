/** @jsx React.DOM */

define(['react', 'lodash', 'he-libs/utils', 'he-libs/mixins'], function(React, _) {

var HEForm = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common],
  render: function() {
    return (
      <form className={this.getClass('form')} role="form">
        {this.props.children}
      </form>
    );
  }

}); //CommentForm

///////////////////////////////////// Form.Text /////////////////////////////////////////
HEForm.Text = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common, HE.UI.mixins.input],
  render: function(){
    return (
      <div className="form-group">
        {this.hasTitle()?<label>{this.getTitle()}</label>:''}
        <input {...this.except(['className', 'value', 'title', 'data-lab'])} className={this.getClass('form-control')} type="text" valueLink={this.getValueLink()}/>
      </div>
    );
  }
})
///////////////////////////////////// Form.Text /////////////////////////////////////////

///////////////////////////////////// Form.TextArea /////////////////////////////////////////
HEForm.TextArea = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common, HE.UI.mixins.input],
  render: function(){
    return (
      <div className="form-group">
        {this.hasTitle()?<label>{this.getTitle()}</label>:''}
        <textarea {...this.except(['className', 'value'])} className={this.getClass('form-control')} type="text" valueLink={this.getValueLink()}/>
      </div>
    );
  }
})
///////////////////////////////////// Form.TextArea /////////////////////////////////////////

///////////////////////////////////// Form.Label /////////////////////////////////////////
HEForm.Label = React.createClass({
  mixins: [HE.UI.mixins.common, HE.UI.mixins.input, React.addons.LinkedStateMixin],
  render: function(){
    return (
      <div className="form-group">
        <label>{this.getTitle()}</label>
      </div>
    );
  }
})
///////////////////////////////////// Form.Label /////////////////////////////////////////

///////////////////////////////////// Form.Submit /////////////////////////////////////////
HEForm.Submit = React.createClass({
  mixins: [HE.UI.mixins.common],
  render: function(){
    return (
      <button {...this.except('className')} type="submit" className={this.getClass("btn btn-default")} value={this.getTitle()}>{this.getTitle()}</button>
    );
  }
})
///////////////////////////////////// Form.Text /////////////////////////////////////////


HE.UI.setInstance('Form', HEForm);
return HEForm;

}); //define
