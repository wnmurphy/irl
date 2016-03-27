// Array containing style configuration for Google Map.
var style = [
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#6195a0" }
    ]
  },

  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      { "visibility": "on" }
    ]
  },

  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "lightness": "0" },
      { "saturation": "0" },
      { "color": "#f5f5f2" },
      { "gamma": "1" }
    ]
  },

  {
    "featureType": "landscape.man_made",
    "elementType": "all",
    "stylers": [
      { "lightness": "-3" },
      { "gamma": "1.00" }
    ]
  },

  {
    "featureType": "landscape.natural.terrain",
    "elementType": "all",
    "stylers": [
      { "visibility": "on" }
    ]
  },

  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
      { "visibility": "on" }
    ]
  },

  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#bae5ce" },
      { "visibility": "on" }
    ]
  },

  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      { "saturation": -100 },
      { "lightness": 45 },
      { "visibility": "simplified" }
    ]
  },

  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },

  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#fac9a9" },
      { "visibility": "simplified" }
    ]
  },

  {
    "featureType": "road.highway",
    "elementType": "labels.text",
    "stylers": [
      { "color": "#4e4e4e" }
    ]
  },

  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#787878" }
    ]
  },

  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  },

  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },

  {
    "featureType": "transit.station.airport",
    "elementType": "labels.icon",
    "stylers": [
      { "hue": "#0a00ff" },
      { "saturation": "-77" },
      { "gamma": "0.57" },
      { "lightness": "0" }
    ]
  },

  {
    "featureType": "transit.station.rail",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#43321e" }
    ]
  },

  {
    "featureType": "transit.station.rail",
    "elementType": "labels.icon",
    "stylers": [
      { "hue": "#ff6c00" },
      { "lightness": "4" },
      { "gamma": "0.75" },
      { "saturation": "-68" }
    ]
  },

  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      { "color": "#eaf6f8" },
      { "visibility": "on" }
    ]
  },

  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#c7eced" }
    ]
  },

  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      { "lightness": "-49" },
      { "saturation": "-53" },
      { "gamma": "0.79" }
    ]
  }
]

// Create a Google Map element.
// Takes current user location, component as context to render within, and callback.
var initMap = function (location, context, callback) {
  // Redfine the set method to hide POI elements
  var set = google.maps.InfoWindow.prototype.set;
  google.maps.InfoWindow.prototype.set = function (key) {
    if (key === 'map' && !this.get('allow')) {
      return;
    }
    set.apply(this, arguments);
  }
  // Create a Google maps LatLng object on location parameter.
  var position = new google.maps.LatLng(location.latitude, location.longitude);

  // Create a new map and append to #map element.
  var map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    streetViewControl: false,
    center: position,
    scrollwheel: true,
    zoom: 14,
    zoomControl: false
  });

  // Create a new style object for map, using the config array above.
  var type = new google.maps.StyledMapType(style, {name: 'IRL'});
  map.mapTypes.set('IRL', type);
  map.setMapTypeId('IRL');

  // Extend Map prototype with ability to offset the map center.
  // Useful for styling map around other elements.
  google.maps.Map.prototype.offsetPan = function(position, x, y) {
    var map = this;
    var overlay = new google.maps.OverlayView();
    overlay.onAdd = function() {
      var projection = this.getProjection();
      var point = projection.fromLatLngToContainerPixel(position);
      point.x = point.x + x;
      point.y = point.y + y;
      map.panTo(projection.fromContainerPixelToLatLng(point));
    };
    overlay.draw = function() {};
    overlay.setMap(this);
  };

  // Listen for the end of a drag and update the map center.
  google.maps.event.addListener(map, 'dragend', function(event) {
    var center = {
      latitude: this.center.lat(),
      longitude: this.center.lng()
    }
    context.setState({center: center});
    context.setState({selected: false});
    if (context.getSpots) {
      context.getSpots();
    }
  });

  google.maps.event.addListener(map, 'zoom_changed', function(event) {
    if (context.state.selected) {
      map.offsetPan(context.state.selected, 0, -50);
    }
  });

  var icon = {
    url: '/img/map/you_test.png'
  };

  // Define marker for user location.
  // (i.e. 'You are here.')
  var marker = new google.maps.Marker({
    icon: icon,
    position: position,
    map: map,
    getPosition: function() {
      return this.position;
    }
  });

  // Set component's state for position, map and marker.
  context.setState({selected: position});
  context.setState({position: position});
  context.setState({map: map});
  context.setState({marker: marker});

  callback(map, position, marker, location);
}

// Loop through spot data from server.
// Generate a map marker and summary bubble for each spot.
var createMarker = function(spot, animate, context) {

  var contentString = '<div style="font-size: 14px"><strong>' + spot.name  + '</strong></div>' +
                      '<div style="font-size: 11px;"><strong>by <a href="/#/profile/' + spot.creatorId + '" class="map-view-userid">' + spot.creator + '</a>' + '</strong></div>' +
                      '<div style="font-size: 11px; padding-top: 2px"><i class="' + categories[spot.category] + '"></i> ' + spot.category + '</div>' +
                      '<div><small><small>' + timeController.stringifyTime(spot) + '</small></small></div>' +
                      '<div><small><small><a href="#/spot/' + spot.spotId +'">More Details</a></small></small></div>';

  var icon = {
    url: '../img/map/pin_test.png'
  };

  // Define summary bubble for each spot.
  var infoWindow = new google.maps.InfoWindow({
    allow: true,
    maxWidth: 250,
    content: contentString
  });

  var animation;

  if (animate) {
    animation = google.maps.Animation.DROP;
  } else {
    animation = null;
  };

  // Create a new map marker for each spot.
  var spot = new google.maps.Marker({
    infoWindow: infoWindow,
    icon: icon,
    position: new google.maps.LatLng(spot.location.latitude, spot.location.longitude),
    map: context.state.map,
    id: spot.spotId,
    info: contentString,
    animation: animation,
    fields: spot.name + " " + spot.description + " " + spot.category,
    getId: function() {
      return this.id;
    },
    getPosition: function() {
      return this.position;
    },
    getFields: function() {
      return this.fields;
    },
    getInfoWindow: function() {
      return this.infoWindow;
    }
  });

  // Update markers in component's state
  var cache = context.state.markers;
  cache.push(spot);
  context.setState({markers: cache});

  // When user clicks on spot, open summary bubble, load that spot's data, and center the map on the marker.
  google.maps.event.addListener(spot, 'click', function () {
    if (context.state.previous) {
      context.state.previous.close();
    }
    infoWindow.setContent(this.info);
    infoWindow.open(context.state.map, this);
    context.setState({previous: this.getInfoWindow()});
    context.setState({selected: this.getPosition()});
    context.state.map.offsetPan(this.getPosition(), 0, -55);
  })

  // When a user clicks to close the info window, set the selected state to be center of the map.
  google.maps.event.addListener(infoWindow,'closeclick', function () {
    var center = context.state.map.getCenter();
    context.setState({selected: center});
  });
}

var sweepMarkers = function(context, callback) {
  context.state.markers.forEach(function(marker, index, object) {
    var match = false;
    for(var i = 0; i < context.state.spots.length; i++) {
      if(context.state.spots[i].spotId.toString() === marker.getId().toString()) {
        var cache = context.state.spots;
        cache.splice(context.state.spots[i], 1);
        context.setState({spots: cache})
        match = true;
      }
    };
    if (!match) {
      marker.setVisible(false);
      var cache = context.state.markers;
      cache.splice(context.state.markers[index], 1);
      context.setState({markers: cache})
    };
  });
  callback();
}

var placeMarker = function(context, query, infoWindow, map, name) {

  context.setState({location: {latitude: query.geometry.location.lat(), longitude: query.geometry.location.lng() } });

  context.setState({ address: query.formatted_address });

  if (!query.geometry) {
    return;
  }

  if (query.geometry.viewport) {
    map.fitBounds(query.geometry.viewport);
  } else {
    map.setCenter(query.geometry.location);
    map.setZoom(14);
  }

  // Set the position of the marker using the query ID and location.
  context.state.marker.setPlace(({
    placeId: query.place_id,
    location: query.geometry.location
  }));

  //context.state.marker.setVisible(true);

  var parts = query.formatted_address.split(',');
  var street = parts[0];
  var locality = parts[1] + ', ' + parts[2];

  if (query.address_components) {
    var component = query.address_components[0].long_name + ' ' + query.address_components[1].short_name;
    var placeName = query.name;

    if (component === placeName) {
      query.name = "Spot";
    }
  } 

  if (name) {
    query.name = name;
  }
  
  context.state.marker.setIcon('/img/map/pin_test.png');
  
  infoWindow.setContent('<div><strong>' + query.name + '</strong><br>' + street + '<br>' + locality + '</div>');

  infoWindow.open(map, context.state.marker);

}
