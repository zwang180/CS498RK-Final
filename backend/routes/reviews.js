var Response = require('../config/secrets').template;
var Review = require('../models/review');

module.exports = function(router) {
  // Shortcut For Store Review
  var storeReview = router.route('/store');
  storeReview.get(function(req, res) {
    var response = new Response();
    Review.find({forStore: true }, function (err, doc) {
      if (err) {
        response.message = "An Error Occurred, Check Your Parameters Or Try It Again";
        res.status(500).json(reponse);
      }
      else {
        response.message = "OK";
        response.data = doc;
        res.status(200).json(response);
      }
    });
  });

  // Shortcut For Item Review
  var itemReview = router.route('/item');
  itemReview.get(function(req, res) {
    var response = new Response();
    Review.find({forStore: false }, function (err, doc) {
      if (err) {
        response.message = "An Error Occurred, Check Your Parameters Or Try It Again";
        res.status(500).json(reponse);
      }
      else {
        response.message = "OK";
        response.data = doc;
        res.status(200).json(response);
      }
    });
  });

  var generalReview = router.route('/all');
  generalReview.get(function(req, res) {
    var response = new Response();
    // Check where parameter
    where = req.query.where ? eval("(" + req.query.where + ")") : {};
    // Create basic query
    var query = Review.find(where);
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
        res.status(500).json(reponse);
      }
      else {
        response.message = "OK";
        response.data = doc;
        res.status(200).json(response);
      }
    });
  })

  generalReview.post(function(req, res) {
     var response = new Response();
     var new_review = new Review(req.body);
     new_review.save(function(err) {
       // Check for error
       if(err) {
         res.message = "Some Error Occurred! Please Try Again!";
         res.status(500).json(response);
       }
       else {
         response.message = "Review Added";
         response.data = new_review;
         res.status(201).json(response);
       }
     });
  });

  generalReview.options(function(req, res) {
    res.writeHead(200);
    res.end();
  });

  var specificReview = router.route('/all/:id');
  specificReview.get(function(req, res) {
    var response = new Response();
    Review.findById(req.params.id, function(err, doc) {
      if(err || !doc) {
        response.message = "Review not found";
        res.status(404).json(response);
      }
      else {
        response.message = "OK";
        response.data = doc;
        res.status(200).json(response);
      }
    });
  });

  specificReview.put(function(req, res) {
    var response = new Response();
    // Create a new object based on req.body
    var new_review = new Review(req.body);
    // Convert to object
    new_review = new_review.toObject();
    // Remove _id field and dateCreated field since we do not want to modify that
    delete new_review._id;
    delete new_review.dateCreated;
    delete new_review.forStore;
    // Doing the update
    Review.findByIdAndUpdate(req.params.id, new_review, { new: true, runValidators: true }, function(err, doc) {
      // Check for error
      if(err) {
        res.message = "Some Error Occurred! Please Try Again!";
        res.status(500).json(response);
      }
      else {
        response.message = "Review Added";
        response.data = new_review;
        res.status(201).json(response);
      }
    });
  });

  specificReview.delete(function(req, res) {
    var response = new Response();
    Review.findById(req.params.id, function(err, doc) {
      if(err) {
        response.message = "Review Not Found";
        res.status(404).json(response);
      }
      else {
        if(doc) {
          doc.remove(function(err) {
            if(err) {
              response.message = "Review Not Found";
              res.status(404).json(response);
            }
            else {
              response.message = "Review Deleted";
              res.status(200).json(response);
            }
          });
        }
        else {
          response.message = "Review Not Found";
          res.status(404).json(response);
        }
      }
    });
  });

  return router;
}
