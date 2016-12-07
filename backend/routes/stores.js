var Response = require('../config/secrets').template;
var Store = require('../models/store');

module.exports = function(router) {

    // router.use(function(req, res, next){
    //     console.log('Something is happening.');
    //     next();
    // });


    router.route('/stores')
        .options(function(req, res){
            res.writeHead(200);
            res.end();
        })
        //creating a store
        .post(function (req, res) {
            var store = new Store(req.body);
            store.save(function (err) {
                if(err) {
                    res.status(500).json(err);
                }
                else {
                    //res.sendStatus(201);
                    res.status(201).json({message: "Store created!", data: store});
                }
            });

            //res.send(req.body.name);


        })

        //getting all stores
        .get(function (req, res) {
            if(req.query.where) {
                var query = eval("("+req.query.where+")");
                //console.log(query);
                Store.find(query, function (err, stores) {
                    if (err) {
                        res.send(err);
                    }
                    else{
                        res.json({message: "OK", data: stores});
                    }
                })
            }

            else if(req.query.sort){
                var query = eval("("+req.query.sort+")");
                Store.find({}).sort(query).exec(function (err, stores) {
                    if (err) {
                        res.send(err);
                    }

                    else{
                        res.json({message: "OK", data: stores});
                    }
                })
            }

            else if(req.query.select) {
                var query = eval("("+req.query.select+")");
                Store.find({}).select(query).exec(function (err, stores) {
                    if (err) {
                        res.send(err);
                    }
                    else{
                        res.json({message: "OK", data: stores});

                    }
                })
            }

            else if(req.query.skip && req.query.limit) {
                var skipnum = eval("("+req.query.skip+")");
                var limitnum = eval("("+req.query.limit+")");

                Store.find({}).skip(skipnum).limit(limitnum).exec(function (err, stores) {
                    if (err) {
                        res.send(err);
                    }

                    else {
                        res.json({message: "OK", data: stores});
                    }
                })
            }

            else if(req.query.count){
                var countbool = eval("("+req.query.count+")");
                Store.find({}).count(countbool).exec(function (err, stores) {
                    if (err) {
                        res.send(err);
                    }

                    else{
                        res.json({message: "OK", data: stores});
                    }
                })
            }

            else {
                Store.find(function (err, stores) {
                    if (err) {
                        res.send(err);
                    }

                    else{
                        res.json({message: "OK", data: stores});
                    }
                })
            }


        });

    router.route('/stores/:store_id')
        .get(function (req, res) {
            Store.findById(req.params.store_id, function (err, stores) {
                if(err) {
                    res.send(err);
                }

                else if(stores == null){
                    res.status(404).json({message: "Store not found", data: []});
                }
                else{
                    res.json({message: "OK", data: stores});
                }
            })

        })

        .put(function (req, res) {
          response = new Response();
          var new_store = new Store(req.body);
          // Convert to object
          new_store = new_store.toObject();
          // Remove _id field and dateCreated field since we do not want to modify that
          delete new_store._id;
          delete new_store.dateCreated;
          // Doing the update
          Store.findByIdAndUpdate(req.params.store_id, new_store, { new: true }, function(err, doc) {
            // Check for error
            if(err) {
                response.message = err.message;
                res.status(500).json(response);
              }
            else {
              response.message = "Store updated";
              response.data = doc;
              res.status(200).json(response);
            }
          });
        })

        .delete(function (req, res) {
            Store.remove({
                _id: req.params.store_id
            }, function (err, stores) {
                if(err) {
                    res.send(err);
                }

                else if(stores==null){
                    res.status(404).json({message: "Store not found", data:[]});
                }
                else{
                    res.json({message: 'Successfully deleted'});
                }
            });
        });

    return router;
}
