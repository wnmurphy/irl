/** @jsx React.DOM */

var MapView = React.createClass({

  getInitialState: function () {
    return {
      spots: []
    };
  },

  componentWillMount: function () {
    this.getLocation();
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/map',
      dataType: 'json',
      success: function(data) {
        context.setState({spots: data});
        console.log("SUCCESS: ", context.state.spots);
      },
      error: function(error) {
        console.log("ERROR: ", error);
      }
    })
  },

  componentDidUpdate: function () {
    this.initMap();
    this.render();
  },

  getLocation: function () {
    var currentLocation = {};
    var context = this;
    navigator.geolocation.getCurrentPosition(function(position){
      currentLocation.latitude = position.coords.latitude;
      currentLocation.longitude = position.coords.longitude;
      context.setState({location: currentLocation});
    }, function(error){
      console.log(error);
    });
  },

  initMap: function () {
    var position = {lat: this.state.location.latitude, lng: this.state.location.longitude};

    var map = new google.maps.Map(document.getElementById('map'), {
      center: position,
      scrollwheel: true,
      zoom: 13
    });

    var myMarker = new google.maps.Marker({
      position: position,
      map: map,
      title: 'My Location'
    });

    myMarker.setIcon('http://maps.google.com/mapfiles/arrow.png');

    for(var i = 0; i < this.state.spots.length - 1; i++) {

      var spot = this.state.spots[i];

      var contentString = '<div>Name: ' + spot.name + '</div>' +
                          '<div>Host: ' + spot.creator + '</div>' +
                          '<div>Description: ' + spot.description + '</div>';

      var spot = new google.maps.Marker({
        position: {lat: spot.location.latitude, lng:spot.location.longitude},
        map: map,
        name: spot.name,
        description: spot.description,
        info: contentString
      });

      var infoWindow = new google.maps.InfoWindow({
        content: contentString
      })

      google.maps.event.addListener(spot, 'click', function () {
        infoWindow.setContent(this.info);
        infoWindow.open(map, this);
      })
    }
  },

  render: function () {
    return (
      <div className="map-view-container">
        <div id="map"></div>  
        <div className="create-button-container">
          <a href="#/create" className="circle">
            <i className="material-icons">add</i>
          </a>
        </div>
      </div>
    );
  }
});
