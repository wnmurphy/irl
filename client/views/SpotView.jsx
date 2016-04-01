// This component renders the full-page view for more spot information.
var SpotView = React.createClass({

  getInitialState: function () {
    var hash = window.location.hash.substr(1);
    return {
      spotHash: hash,
      // Define default text for sharing a spot.
      shareProps: {
        contents: 'Check out this Spot! app.irl.events/#' + hash,
        subject: 'Check out irl',
        url: 'app.irl.events/#' + hash
      },
      spot: {},
      shareClass: "share-card-container",
      buttonIcon: "fa fa-share-alt",
      sharing: false,
      showChat: "",
      messages: [],
      login: 'hide',
      saving: false
    };
  },

  // Load spot's data from server via AJAX.
  // Load spot's chat messages via socket.
  componentDidMount: function () {
    var context = this;
    this.getSpot();
    var id = Number(this.state.spotHash.split('/spot/')[1]);
    this.setState({spotId: id});
    socket.emit('populateChat', id);
    socket.on('returnChat', function(data) {
      context.setState({messages: data});
    })
  },

  // Defines AJAX call to server to retrieve spot data.
  // Adds a new map marker if successful.
  getSpot: function () {
    var context = this;

    this.setState({loading: true});

    $.ajax({
      method: 'GET',
      url: '/api' + context.state.spotHash,
      dataType: 'json',
      success: function (data) {
        context.setState({spot: data});
        MetaController.setOGP({
          title: context.state.spot.name,
          description: context.state.spot.description
        });
        context.setState({loading: false});
        context.setState({profileId: data.creatorId});
        context.setState({creatorId: "/#/profile/" + data.creatorId});
        initMap(data.location, context, function(map, position, marker) {
          map.setOptions({zoomControl: false});
          marker.setOptions({optimized: false});
          marker.setIcon('/img/map/marker_animated.gif');
        });
        if (data.end) {
          var durationTime = timeController.msToDuration(Number(data.end));
          context.setState({end: durationTime});
        }
      },
      error: function (error) {
        context.setState({loading: false});
      }
    });
  },

  // Open share card when user clicks Share button.
  toggleShare: function () {
    var sharing = !this.state.sharing;
    var newState = {sharing: sharing};
    if (this.state.buttonIcon === "fa fa-share-alt") {
      newState.buttonIcon = "fa fa-times",
      newState.shareClass = "share-card-container show-share-card"
    } else {
      newState.buttonIcon = "fa fa-share-alt",
      newState.shareClass = "share-card-container",
      newState.showChat = ""
    }
    this.setState(newState);
  },

  // Open chat card when user clicks chat button.
  toggleChat: function (){
    if (this.state.showChat === ""){
      this.setState({
        showChat: " show",
        buttonIcon: "fa fa-times"
      });
    } else {
      this.setState({
        showChat: "",
        buttonIcon: "fa fa-share-alt"
     });
    }
  },

  checkAuth: function () {
    //async issue to call this.post after setting state for saving to true
    if (localStorage.getItem('token')) {
      this.setState({saving: true}, this.post);
    } else {
      this.setState({login: 'show', saving: true});
    }
  },

  post: function () {
    //save spots only runs when user clicks save spot from DOM
    var context = this;
    if (this.state.saving) {
      SaveSpotController.saveSpot(this.state.spotId, function (spot) {
        context.setState({toastMessage: 'Spot Saved'});
      }, function(err) {
        context.setState({toastMessage: 'Spot Already Saved'});
        console.error(err);
      });
    }

  },

  render: function () {

    var chatContainerClass = "chat-card-container";

    return (
      <div className="spot-container">
        <div className="create-map-view-container">
          <div id="map">
          </div>
            <div className="spot-view-address">
              <p>{this.state.spot.address}</p>
           </div>
        </div>
        <div className='spot-view-container'>
          <p className='spot-view-name'>{this.state.spot.name}</p>
          <p className='spot-view-time'>{timeController.stringifyTime(this.state.spot, true)}</p>
          <a href={this.state.creatorId}><div className='spot-view-profile-picture' style={{'backgroundImage': 'url(' + this.state.spot.img + ')'}}></div></a>
          <p className='spot-view-creator'><small>Created by {this.state.spot.creator}</small></p>
          <p className='spot-view-category'><i className={categories[this.state.spot.category]}></i></p>
          <p className='spot-view-about'>About This Spot</p>
          <div className='description-container'>
            <p className='spot-view-description'>{this.state.spot.description}</p>
          </div>
            <div className='button-container'>
              <DirectionsLink location={this.state.spot.location} />
              <div className='button' onClick={this.checkAuth}><i className="material-icons">check_circle</i>&nbsp;Save spot</div>
              <div className='button' onClick={this.toggleChat}><i className="material-icons">message</i>&nbsp;show chat</div>
              <Toast message={this.state.toastMessage} />
            </div>
        </div>
        <div className={this.state.shareClass} onClick={this.toggleShare}>
          <ShareCard shareProps={this.state.shareProps}/>
        </div>
        <div className="share-button-container">
          <a onClick={this.toggleShare} className="circle">
            <i className={this.state.buttonIcon}></i>
          </a>
        </div>
        <div className={chatContainerClass + this.state.showChat}>
          <Chat messages={this.state.messages} spotId={this.state.spotId}/>
        </div>
        <div className={this.state.login}>
          <LoginRequired parent={this} />
        </div>
      </div>
    );
  }
});
