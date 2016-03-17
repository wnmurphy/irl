/** @jsx React.DOM */

// This will be used as the min time (ms) to show
// welcome-view-container
var React = React || require('react');
var welcomeScreenTimeout = 1000;

var MapView = React.createClass({

  getInitialState: function () {
    return {
      spots: globalState.spots,
      selected: {},
      location: globalState.location,
      refreshButton: "refresh-button-container",
      buttonClass: "hide"
    };
  },

  componentDidMount: function() {

    var context = this;

    // Listen for spots created by other users and refresh map.
    // socket.on('spotAdded', this.getSpots);

    if(!globalState.location) {
      context.setState({showScreen: true})
      setTimeout(function() {
        getLocation(function(location) {
        initMap(location, context, function() {
          context.setState({buttonClass: "circle"});
          context.getSpots();
        });
      }, context);
      }, welcomeScreenTimeout);
    } else {
        context.setState({showScreen: false})
        initMap(globalState.location, context, function() {
          context.setState({buttonClass: "circle"});
          context.getSpots();
        });
    }
  },

  getSpots: function () {

    var context = this;

    this.setState({refreshButton: "refresh-button-container spin"});

    $.ajax({
      method: 'GET',
      url: '/api/map',
      dataType: 'json',
      success: function (data) {
        globalState.spots = data;
        context.setState({spots: data});
        //console.log("SUCCESS: ", context.state.spots);
        context.setState({refreshButton: "refresh-button-container"});
        context.initSpots();

      },
      error: function (error) {
        console.log("ERROR: ", error);
        context.setState({refreshButton: "refresh-button-container"});
      }
    })
  },

  initSpots: function () {
    // need to make this wait to run until map loads
    var context = this;
    var start_am_pm = 'AM';
    var end_am_pm = 'AM'
    for(var i = 0; i < this.state.spots.length; i++) {

      var spot = this.state.spots[i];
      var start, end, startMinutes, endMinutes;


      if(spot.lastId) {
        continue;
      }

      if(spot.start) {
        start = Number(spot.start.split(":")[0]);
        startMinutes = spot.start.split(":")[1];

        if(start > 12) {
          start -= 12;
          start_am_pm = 'PM';
        }
        if(start === 0) {
          start = 12;
          start_am_pm = 'AM';
        }
        if(start > 12) {
          if(start === 12) {
            start_am_pm = 'PM';
          }
          else {
            start -= 12;
            start_am_pm = 'PM';
          }
        }

      }

      if(spot.end) {
        end = Number(spot.end.split(":")[0]);
        endMinutes = spot.end.split(":")[1];
        if(end < 12) {
          end_am_pm = 'AM';
        }
        if(end === 12) {
          end_am_pm = 'PM';
        }
        if(end === 0) {
          end = 12;
          end_am_pm = 'AM';
        }
        if(end > 12) {
          if(end === 12) {
            end_am_pm = 'PM';
          }
          else {
            end -= 12;
            end_am_pm = 'PM';
          }
        }

      }

      var contentString = '<div>Name: ' + spot.name + '</div>' +
                          '<div>Host: ' + spot.creator + '</div>' +
                          '<div>Category: ' + spot.category + '</div>' +
                          '<div>Description: ' + spot.description + '</div>' +
                          '<div>Start Time: ' + start + ':' + startMinutes + ' ' + start_am_pm + '</div>' +
                          '<div>End Time: ' + end + ':' + endMinutes + ' ' + end_am_pm + '</div>' +
                          '<div><a href="#/spot/' + spot.spotId +'">More Details</a></div>';

      var icon = {
        url: '/pin.png'
      }

      var spot = new google.maps.Marker({
        icon: icon,
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
        maxWidth: 150,
        content: contentString
      })

      google.maps.event.addListener(spot, 'click', function () {
        infoWindow.setContent(this.info);
        infoWindow.open(context.state.map, this);
        context.setState({selected: this.getId()});
        context.state.map.panTo(this.getPosition());
        //console.log(context.state.selected);
      })
    }
  },

  center: function() {
    this.state.map.panTo(this.state.position);
  },

  render: function () {
    return (
      <div className="map-view-container">
        <div id="map">
          {this.state.showScreen ? <LoadScreen /> : null}
        </div>
        <div className="create-button-container">
          <a href="#/create" className={this.state.buttonClass}>
            <i className="material-icons">add</i>
          </a>
        </div>
        <div className={this.state.refreshButton}>
          <a onClick={this.getSpots} className={this.state.buttonClass}>
            <i className="material-icons">refresh</i>
          </a>
        </div>
        <div className="center-button-container">
          <a onClick={this.center} className={this.state.buttonClass}>
            <i className="material-icons">gps_fixed</i>
          </a>
        </div>
      </div>
    );
  }
});

var LoadScreen = React.createClass({
  render: function() {
    return (
      <div className="welcome-container">
        <div>
          <h1>irl</h1>
          <h2>welcome!</h2>
          <p>your map is loading...</p>
        </div>
      </div>
    )
  }
})
