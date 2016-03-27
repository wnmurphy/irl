var AuthController = {
  initAuth: function (callback) {
    AuthController.signedIn = false;
    globalState.userId = localStorage.getItem('userId');
    if (!globalState.userId) localStorage.removeItem('token');
    var token = localStorage.getItem('token');
    if (token) {
      AuthController.signedIn = true;
      $.ajaxSetup({
        headers: { 'token': token }
      });
    }
  },

  signOut: function (callback) {
    localStorage.removeItem('token');
    AuthController.initAuth();
    window.location.hash = '';
  },

  sendLogin: function (login, success, fail) {
    $.ajax({
      method: 'POST',
      url: '/api/login',
      dataType: 'json',
      data: login,
      success: function (data) {
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        AuthController.initAuth();
        success();
      },
      error: function (error) {
        AuthController.signOut();
        fail(error.responseText);
      }
    });
  },

  sendSignup: function (user, success, fail) {
    $.ajax({
      method: 'POST',
      url: '/api/signup',
      dataType: 'json',
      data: user,
      success: function (data) {
        globalState.userId = data.userId;
        localStorage.setItem('token', JSON.stringify(data.token));
        AuthController.initAuth();
        success();
      },
      error: function (error) {
        fail(error.responseText);
      }
    });
  }
};
