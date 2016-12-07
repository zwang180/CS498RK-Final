var Response = require('../config/secrets').template;
var User = require('../models/user');
var passport = require('passport');

module.exports = function(router) {
  // User registration
  var userRegister = router.route('/register');
  userRegister.post(function(req, res) {
    var new_user = new User(req.body);
    var response = new Response();
    User.register(new_user, req.body.password, function(err, user) {
      if(err) {
        response.message = err.message;
        return res.status(500).json(response);
      }
      else {
        passport.authenticate('local')(req, res, function() {
          response.message = "Login Success";
          response.data = user;
          return res.status(200).json(response);
        });
      }
    });
  });
  // User login
  var userLogin = router.route('/login');
  userLogin.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });
  userLogin.post(function(req, res, next) {
    var response = new Response();
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      }
      else if (!user) {
        response.message = "Unauthorized User!";
        return res.status(401).json(response);
      }
      else {
        req.logIn(user, function(err) {
          if (err) {
            response.message = "Could Not Log User In";
            return res.status(500).json(response);
          }
          else {
            response.message = "Login Success!"
            response.data = user;
            res.status(200).json(response);
          }
        });
      }
    })(req, res, next);
  });
  // User logout
  var userLogout = router.route('/logout');
  userLogout.get(function(req, res) {
    var response = new Response();
    req.logout();
    response.message = "Logout Success!";
    res.status(200).json(response);
  });
  // For persistent login
  var userStatus = router.route('/status');
  userStatus.get(function(req, res) {
    var response = new Response();
    if (!req.isAuthenticated()) {
      response.message = "Not Authenticated!";
      response.data.push(false);
      return res.status(200).json(response);
    }
    else {
      response.message = "Authenticated!";
      response.data.push(true);
      res.status(200).json(response);
    }
  });
  // User info
  var userInfo = router.route('/update/:id');
  userInfo.put(function(req, res) {
    response = new Response();
    var new_user = new User(req.body);
    // Convert to object
    new_user = new_user.toObject();
    // Remove _id field and dateCreated field since we do not want to modify that
    delete new_user._id;
    delete new_user.dateCreated;
    delete new_user.username;
    delete new_user.password;
    // Doing the update
    User.findByIdAndUpdate(req.params.id, new_user, { new: true, runValidators: true }, function(err, doc) {
      // Check for error
      if(err) {
          response.message = err.message;
          res.status(500).json(response);
        }
      else {
        response.message = "User updated";
        response.data = doc;
        res.status(200).json(response);
      }
    });
  })

  var userAll = router.route('/alluser/');
  userAll.get(function(req, res) {
    var response = new Response();
    // Check where parameter
    where = req.query.where ? eval("(" + req.query.where + ")") : {};
    // Create basic query
    var query = User.find(where);
    // Check sort parameter
    if(req.query.sort) {
      query = query.sort(eval("(" + req.query.sort + ")"));
    }
    // Check select parameter
    if(req.query.select) {
      query = query.select(eval("(" + req.query.select + ")"));
    }
    // Check skip parameter
    if(req.query.skip) {
      query = query.skip(eval("(" + req.query.skip + ")"));
    }
    // Check limit parameter
    if(req.query.limit) {
      query = query.limit(eval("(" + req.query.limit + ")"));
    }
    // Check count parameter, eval() is awesome
    if(eval(req.query.count)) {
      query = query.count();
    }
    // Execute query
    query.exec(function (err, doc) {
      // If error occurred
      if (err) {
        response.message = "An Error Occurred, Check Your Parameters Or Try It Again";
        res.status(500).json(response);
      }
      else {
        response.message = "OK";
        response.data = doc;
        res.status(200).json(response);
      }
    });
  })

  return router;
}
