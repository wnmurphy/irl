/** @jsx React.DOM */

var LoginRequired = React.createClass({
  getDefaultProps: function () {
    // post runs when user is already signed in or after successful signin
    return {
      parent: {post: function () {}}
    };
  },

  getInitialState: function () {
    var state = {
      signup: false
    };
    if (AuthController.signedIn) {
      state.cardContainerClass = 'createView-card-container hide';
      this.props.parent.post();
    } else {
      state.cardContainerClass = 'createView-card-container';
    }
    return state;
  },

  handleLogin: function () {
    console.log("handling login");
    this.setState({cardContainerClass: 'createView-card-container hide'});
    this.props.parent.post();
  },

  toggleCard: function () {
    this.setState({
      signup: !this.state.signup
    })
  },

  render: function () {
    if (this.state.signup) {
      var card = <SignupCard parent={this} />;
    } else {
      var card = <LoginCard parent={this} />;
    }

    return (
      <div className={this.state.cardContainerClass}>
        {card}
      </div>
    );
  }
});

var LoginCard = React.createClass({
  getInitialState: function () {
    return {response: ''};
  },

  handleChange: function (e) {
    var newState = {};
    console.log("handleChange:", this.state);
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  },

  toggleCard: function () {
    this.props.parent.toggleCard();
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var context = this;
    console.log("handleSubmit:", this.state);
    // AuthController.js
    AuthController.sendLogin(this.state, function() {
      console.log("Handling login in LoginCard");
      console.log('context: ', context);
      context.props.parent.handleLogin();
    }, function(message) {
      context.setState({response: message});
    });
  },

  render: function() {
    console.log("Rendering LoginView");
    return (
      <div className='login-card'>
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <input name="username" type="text" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <div className="button" onClick={this.handleSubmit}>Log In</div>
          <div className="button" onClick={this.toggleCard}>Create Account</div>
        </form>
        <Toast message={this.state.response} />
      </div>
    );
  }
});

var SignupCard = React.createClass({
  getInitialState: function () {
    return {response: ''};
  },

  handleChange: function (e) {
    var newState = {};
    console.log("handleChange:", this.state);
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  },

  toggleCard: function () {
    this.props.parent.toggleCard();
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var context = this;
    console.log("handleSubmit:", this.state);
    // AuthController.js
    AuthController.sendSignup(this.state, function() {
      console.log("Handling signup in LoginCard");
      console.log('context: ', context);
      context.props.parent.handleLogin();
    }, function(message) {
      context.setState({response: message});
    });
  },

  render: function() {
    console.log("Rendering LoginView");
    return (
      <div className='login-card'>
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <input name="username" type="text" placeholder="Username" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <div className="button" onClick={this.handleSubmit}>Signup</div>
          <div className="button" onClick={this.toggleCard}>Existing Account</div>
        </form>
        <Toast message={this.state.response} />
      </div>
    );
  }
});
