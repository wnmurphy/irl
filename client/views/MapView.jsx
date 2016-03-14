/** @jsx React.DOM */

// This will be used as the min time (ms) to show
// welcome-view-container
var welcomeScreenTimout = 2000;


var MapView = React.createClass({

  getInitialState: function () {
    console.log(globalState);
    return {
      spots: globalState.spots,
      selected: {},
      location: globalState.location
    };
  },

  componentDidMount: function () {

    var context = this;

    var checkForCurrentLocation = function () {
      if (context.state.location) {
        context.initMap();
      } else {
        setTimeout(checkForCurrentLocation, 100);
      }
    }

    // getCurrentPosition only if location is not in globalState
    // otherwise just load map
    if (!globalState.location) {
      this.getLocation();
      setTimeout(checkForCurrentLocation, welcomeScreenTimout);
    } else {
      this.initMap();
    }

    $.ajax({
      method: 'GET',
      url: '/api/map',
      dataType: 'json',
      success: function (data) {
        globalState.spots = data;
        context.setState({spots: data});
        console.log("SUCCESS: ", context.state.spots);
        context.initSpots();
      },
      error: function (error) {
        console.log("ERROR: ", error);
      }
    })
  },

  getLocation: function () {
    var currentLocation = {};
    var context = this;
    navigator.geolocation.getCurrentPosition(function(position){
      currentLocation.latitude = position.coords.latitude;
      currentLocation.longitude = position.coords.longitude;
      console.log(currentLocation);
      globalState.location = currentLocation;
      context.setState({location: currentLocation});
    }, function(error){
      console.log(error);
    });
  },

  initMap: function () {
    var context = this;

    var position = new google.maps.LatLng(this.state.location.latitude, this.state.location.longitude);

    console.log('initMap position:', position);
    var map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
      streetViewControl: false,
      center: position,
      scrollwheel: true,
      zoom: 13
    });

    this.setState({map: map});

    var myMarker = new google.maps.Marker({
      position: position,
      map: map,
      title: 'My Location'
    });

    myMarker.setIcon('http://maps.google.com/mapfiles/arrow.png');

    this.initSpots();
  },

  initSpots: function () {
    // need to make this wait to run until map loads
    var context = this;

    console.log("initializing spot markers");

    for(var i = 0; i < this.state.spots.length; i++) {

      var spot = this.state.spots[i];
      if(spot.lastId) {
        continue;
      }

      var contentString = '<div>Name: ' + spot.name + '</div>' +
                          '<div>Host: ' + spot.creator + '</div>' +
                          '<div>Description: ' + spot.description + '</div>';

      var spot = new google.maps.Marker({
        position: new google.maps.LatLng(spot.location.latitude, spot.location.longitude),
        map: context.state.map,
        id: spot.spotId,
        info: contentString,
        getId: function() {
          return this.id;
        },
        getPosition: function() {
          return this.position;
        }
      });

      var infoWindow = new google.maps.InfoWindow({
        content: contentString
      })

      google.maps.event.addListener(spot, 'click', function () {
        infoWindow.setContent(this.info);
        infoWindow.open(context.state.map, this);
        context.setState({selected: this.getId()});
        context.state.map.panTo(this.getPosition());
        console.log(context.state.selected);
      })
    }
  },

  render: function () {
    return (
      <div className="map-view-container">
        <div id="map">
          <div className="welcome-container">
            <div>
              <h1>Welcome to Happn!</h1>
              <h2>Find the Haps!</h2>
              <p>(your HapMap is loading now)</p>
            </div>
          </div>
        </div>
        <div className="create-button-container">
          <a href="#/create" className="circle">
            <i className="material-icons">add</i>
          </a>
        </div>
      </div>
    );
  }
});
