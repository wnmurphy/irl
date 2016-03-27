var helpers = require('./helpers.js');

module.exports = function(app, express, io) {

  // GET to request index.html from root.
  app.get('/', function(req, res) {
    res.sendFile('../../client/index.html');
  });


  // POST to create a new spot from CreateView.
  app.post('/api/create', function(req, res) {
    var spot = req.body;
    helpers.checkToken(JSON.parse(req.headers.token), function (decoded) {
      spot.creatorId = decoded.userId;
      spot.creator = decoded.username;
      helpers.createSpot(spot, function(newSpot) {
        console.log("SPOT =================>", newSpot);
        res.send(newSpot);
      }, function(err) {
        res.send(err);
      });
    }, function (message) {
      res.send(404, message);
    });
  });



  // POST to request search results for a specific spot from SearchView.
  app.post('/api/search', function(req, res) {
    var search = req.body.search;
    helpers.search(search, function(results) {
      res.json(results);
    }, function(err) {
      res.send(404);
    });
  });


  // GET to request all spots for either MapView or FeedView.
  app.get('/api/map', function(req, res) {
    var location = req.query.location;
    helpers.getSpots(location, function(results) { //null was location
      res.json(results);
    }, function(err) {
      res.send(404);
    });

  });


  // POST to create a new user from SignupView.
  app.post('/api/signup', function(req, res) {
    var user = {
      username: req.body.username.toLowerCase(),
      password: req.body.password,
      email: req.body.email
    };

    helpers.signup(user, function(result) {
      //redirect to main page?
      res.json(result);
    }, function(message) {
      res.send(404, message);
    });
  });


  // POST to submit user credentials from LoginView.
  app.post('/api/login', function(req, res) {
    var user = {
      username: req.body.username.toLowerCase(),
      password: req.body.password
    };
    helpers.signin(user, function(result) {
      res.json(result);
      //res.direct('/#/mainpage', result)
    }, function(message) {
      res.send(404, message);
    });
  });

  // GET to retrieve a user's profile by userId.
  app.get('/api/profile/:id', function(req, res) {
    var id = req.params.id;
    if (req.headers.token) {
      helpers.checkToken(JSON.parse(req.headers.token), function (decoded) {
        var currentUserId = decoded.userId.toString();
        helpers.getProfile(id, function(result) {
          res.json({result: result, currentUser: (id === currentUserId)});
        }, function(err) {
          res.send(404);
        });
      }, function (err) {
        if (id) {
          helpers.getProfile(id, function(result) {
            res.json({result: result, currentUser: false});
          }, function(err) {
            res.send(404);
          });
        } else {
          res.send(404, err);
        }
      });
    } else {
      console.log("no token");
      helpers.getProfile(id, function(result) {
        res.json({result: result, currentUser: false});
      }, function(err) {
        res.send(404);
      });
    }
  });

  // PUT to update user's profile
  app.put('/api/profile', function (req, res){
    if (req.headers.token) {
      helpers.checkToken(JSON.parse(req.headers.token), function (decoded) {
        console.log('token verified');
        var userId = decoded.userId.toString();
        helpers.updateProfile(userId, req.body, function () {
          res.sendStatus(202);
        }, function (err) {
          res.sendStatus(404);
        });
      }, function (err) {
        console.log('invalid token');
        res.send(404, 'invalid token');
      });
    } else {
      console.log("no token");
      res.send(404, 'user not signed in');
    }
  })

  // GET to retrieve a spot's information by spotId.
  app.get('/api/spot/:id', function(req, res) {
    var id = Number(req.params.id);

    helpers.getSpot(id, function(result) {
      res.json(result);
    }, function(err) {
      res.send(404, err);
    });
  });

  //GET to retrieve user's feed data
  app.get('/api/feed/:id', function(req, res) {
    var id = Number(req.params.id);

    helpers.getFeed(id, function(results) {
      res.json(results);
    }, function(err) {
      res.send(404, err);
    });
  });

  //post to follow a user
  app.post('/api/followUser', function(req, res) {
    var userId = req.body.userId;
    var followUser = req.body.followUser;
    helpers.followUser(userId, followUser, function(data) {
      res.json(data);
    }, function(err) {
      res.send(404, err);
    });
  });

  //post to save a users spot
  app.post('/api/saveSpot', function(req, res) {
    var userId = req.body.userId;
    var spotId = req.body.spotId;
    helpers.saveSpot(userId, spotId, function(data) {
      res.json(data);
    }, function(err) {
      res.send(404, err);
    });
  });

  // Sockets

  io.sockets.on('connection', function(socket) {

    /* Spot socket */

    // Listen for whenever a new spot is created, and
    // broadcast spotAdded event to trigger client-side map refresh.
    socket.on('newSpot', function(newSpot){
      socket.broadcast.emit('spotDrop', newSpot);
      console.log("new spot: ", newSpot);
    });


    /* Chat socket */

    // Listen for whenever a chat message is sent.
    socket.on('messageSend', function(message){
      helpers.postMessageToDatabase(message.spotId, message.username, message.text, message.timeStamp);
      io.emit('newMessage', {username: message.username, text: message.text, spotId: message.spotId, timeStamp: message.timeStamp});
    });

    socket.on('populateChat', function(id) {
      helpers.getMessagesFromDatabase(id, function(data) {
        io.sockets.connected[socket.id].emit('returnChat', data);
      });
    })
  });

};
