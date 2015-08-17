/** @jsx React.DOM */

define(['react', 'lodash', 'he-libs/utils', 'he-libs/mixins', 'he-template/ui/Form', 'he-template/ui/Grid', 'he-template/ui/List', 'he-template/ui/Component'], function(React, _) {

var HEUI = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common],
  render: function() {
    return (
      <form className={this.getClass('form')} role="form">
        {this.props.children}
      </form>
    );
  }

}); //CommentForm

///////////////////////////////////// User.List /////////////////////////////////////////
HEUI.List = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common],
  render: function(){
    var users = this.props['data-lab'];
    if(users){
      return <HE.UI.Grid.Columns data-col="lg-5 md-4 sm-3 xs-2 xxs-1">
        {
          Array.isArray(users.getVal())?users.getVal().map(function(user, index){
            return <div key={user.id}>
                    <HE.UI.User.Info data-lab={users.link(index)}></HE.UI.User.Info>
                  </div>;
          }):''
        }
      </HE.UI.Grid.Columns>;
      
    } else {
      return '';
    }
  }
})
///////////////////////////////////// User.List /////////////////////////////////////////

///////////////////////////////////// User.List.Slider /////////////////////////////////////////
HEUI.List.Slider = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common],
  render: function(){
    var users = this.props['data-lab'];
    if(users){
      return (<div>
      <HE.UI.Component.Dropdown data-hover="1" data-auto-close="1">
        <a href="#">
          xasdasd
          <span className="caret"></span>
        </a>
        <div> 
          <div> 1</div>
          <div> 1</div>
          <div> 1</div>
          <div> 1</div>
          <div> 1</div>
          <div> 1</div>
          <div> 1</div>
        </div>
      </HE.UI.Component.Dropdown>
        <HE.UI.List.Slider data-col="lg-5 md-4 sm-3 xs-2 xxs-1" data-slides-to-show="lg-3 md-2 sm-1" data-zoom-level="2" data-active-index="0" data-slide-padding="30" data-slides-to-scroll="1">
        {
          Array.isArray(users.getVal())?users.getVal().map(function(user, index){
            return <div key={user.id}>
                    <HE.UI.User.Info data-lab={users.link(index)}></HE.UI.User.Info>
                  </div>;
          }):''
        }
      </HE.UI.List.Slider>
      </div>
      )
      ;
      
    } else {
      return '';
    }
  }
})
///////////////////////////////////// User.List /////////////////////////////////////////

///////////////////////////////////// User.Info /////////////////////////////////////////
HEUI.Info = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common, HE.UI.mixins.input],
  render: function(){
    var user = this.props['data-lab'];
    if(user){
      return (
        <div className="he-user-info">
          {user.has('firstname')?
          <HE.UI.Form.Text title={user.get('firstname')} data-lab={user} value={user.link('firstname')}></HE.UI.Form.Text>:''
          }
          {user.has('lastname')?
          <HE.UI.Form.Text title={user.get('lastname')} data-lab={user} value={user.link('lastname')}></HE.UI.Form.Text>:''
          }
          {user.has('about')?
          <HE.UI.Form.TextArea title={user.get('about')} data-lab={user} value={user.link('about')}></HE.UI.Form.TextArea>:''
          }
          {user.has('avatar')?
          <HE.UI.User.Avatar data-lab={user}></HE.UI.User.Avatar>:''
          }
          {user.has('cover')?
          <HE.UI.User.Cover data-lab={user}></HE.UI.User.Cover>:''
          }
        </div>
      )
    } else {
      return '';
    }
  }
})
///////////////////////////////////// User.Info /////////////////////////////////////////

///////////////////////////////////// User.Avatar /////////////////////////////////////////
HEUI.Avatar = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common, HE.UI.mixins.user],
  render: function(){
    return (
      <img className={this.getClass('he-user-avatar')} alt={this.getDisplayName()} src={this.getAvatarUrl()}/>
    );
  }
})
///////////////////////////////////// User.Avatar /////////////////////////////////////////

///////////////////////////////////// User.Cover /////////////////////////////////////////
HEUI.Cover = React.createClass({
  mixins: [HE.UI.mixins.lab, HE.UI.mixins.common, HE.UI.mixins.user],
  render: function(){
    return (
      <img className={this.getClass('he-user-cover')} alt={this.getDisplayName()} src={this.getCoverUrl()}/>
    );
  }
})
///////////////////////////////////// User.Avatar /////////////////////////////////////////


HE.UI.setInstance('User', HEUI);
return HEUI;

}); //define
