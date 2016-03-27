var SaveSpotController = {
  saveSpot: function(spotId, success, fail) {
    $.ajax({
      method: 'POST',
      url: '/api/saveSpot/',
      data: {
        "userId": localStorage.getItem('userId'),
        "spotId": spotId
      },
      dataType: 'json',
      success: function (data) {
        console.log("SUCCESSFULLY SAVED SPOT =============>", data);
        success(data);
      },
      error: function (error) {
        fail(error.responseText);
      }
    });
  }
};