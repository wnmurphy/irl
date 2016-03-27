var FollowController = {
  followUser: function(followId, success, fail) {
    $.ajax({
      method: 'POST',
      url: '/api/followUser/',
      data: {
        "userId": localStorage.getItem('userId'),
        "followUser": followId
      },
      dataType: 'json',
      success: function (data) {
        console.log("SUCCESSFULLY FOLLOWED USER =============>", data);
        success(data);
      },
      error: function (error) {
        fail(error.responseText);
      }
    });
  }
};