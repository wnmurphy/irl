// Renders bottom nav menu.

var NavButton = React.createClass({
  getInitialState: function () {
    var linkClass = '';
    return {};
  },

  render: function () {
    return (
      <a href={this.props.href} className={this.state.linkClass}>
        <i className="material-icons">{this.props.icon}</i>
      </a>
    );
  }
});

var NavBar = React.createClass({
  getInitialState: function() {
    return {
      feedUpdate: false,
      buttonClasses: {
        map: '',
        search: '',
        feed: '',
        profile: ''
      }     
    };
  },

  componentDidMount: function () {
    var context = this;
    socket.on('updateFeed', function (follower) {
      context.setState({feedUpdate: true, icon: "fa fa-bell feed-update"}); 
    });
    
    //navbar is defined in app.jsx
    window.navbar = this;
    this.activate();
    
  },

  updateFeed: function () {
    this.setState({feedUpdate:false});
  },

  activate: function () {
    var active;
    var buttonClasses = {
      map: '',
      search: '',
      feed: '',
      profile: ''
    };
    
    switch(window.location.hash) {
      case '#/':
        active = 'map';
        break;
      case '#/search':
        active = 'search';
        break;
      case '#/feed':
        active = 'feed';
        break;
      case '#/profile':
        active = 'profile';
        break;    
    }

    buttonClasses[active] = 'active';
    this.setState({buttonClasses: buttonClasses});
  },

  render: function() {
    return (
      <div>
         <a href="#/" className={this.state.buttonClasses.map}><i className="material-icons">track_changes</i></a>
         <a href="#/search" className={this.state.buttonClasses.search}><i className="material-icons">search</i></a>
         <a href="#/feed" onClick={this.updateFeed} className={this.state.buttonClasses.feed}>
          {!this.state.feedUpdate ? <i className="material-icons">list</i> : <i className="material-icons feed-icon">list</i>}
          {this.state.feedUpdate ? <i className={this.state.icon}></i> : null}
         </a>
         <a href="#/profile" className={this.state.buttonClasses.profile}><i className="material-icons">person</i></a>
      </div>
    );
  }
});
