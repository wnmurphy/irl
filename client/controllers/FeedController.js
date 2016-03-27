var FeedController = {
  getSpots: function(success, fail) {
    //dummy info for testing purposes
    // success({savedSpots: [{
    //     'spotId': 3,
    //     'creator': 'baBell', 
    //     'name': 'partay', 
    //     'category': 'Entertainment', 
    //     'start': '09:00'
    //   }], followedUsersSpots: [{
    //     'spotId': 4,
    //     'creator': 'michelle', 
    //     'name': 'samples', 
    //     'category': 'Food', 
    //     'start': '12:00'
    //   }]}); 

   //working
    $.ajax({
      method: 'GET',
      url: '/api/feed/' + localStorage.getItem('userId'),
      dataType: 'json',
      success: function (data) {
        console.log("SUCCESS RETRIEVED FEED SPOTS =============>", data);
        success(data);
      },
      error: function (error) {
        fail(error.responseText);
      }
    });
  }
};