// used for setting Open Graph Protocol properties on dynamically loaded pages
// Pass in object with {title, description, url, image};
// See getSpot method in SpotView.jsx for example

var MetaController = {
  setOGP: function (ogData) {
    for (var key in ogData) {
      $('head').append('<meta property="og:' + key + '" content="' + ogData[key] + '" />');
    }
  }
};
