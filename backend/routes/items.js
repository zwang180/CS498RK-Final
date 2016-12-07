var Response = require('../config/secrets').template;
var Item = require('../models/item');

module.exports = function(router) {

    // router.use(function(req, res, next){
    //     console.log('Something is happening.');
    //     next();
    // });


    router.route('/items')
        .options(function(req, res){
            res.writeHead(200);
            res.end();
        })
        //creating an item
        .post(function (req, res) {
            var item = new Item(req.body);

            item.save(function (err) {
                if(err) {
                    res.status(500).json(err);
                }

                else {
                    //res.sendStatus(201);
                    res.status(201).json({message: "Item created!", data: item});
                }
            });

            //res.send(req.body.name);


        })

        //getting all items
        .get(function (req, res) {
            if(req.query.where) {
                var query = eval("("+req.query.where+")");
                //console.log(query);
                Item.find(query, function (err, items) {
                    if (err) {
                        res.send(err);
                    }
                    else{
                        res.json({message: "OK", data: items});
                    }
                })
            }

            else if(req.query.sort){
                var query = eval("("+req.query.sort+")");
                Item.find({}).sort(query).exec(function (err, items) {
                    if (err) {
                        res.send(err);
                    }

                    else{
                        res.json({message: "OK", data: items});
                    }
                })
            }

            else if(req.query.select) {
                var query = eval("("+req.query.select+")");
                Item.find({}).select(query).exec(function (err, items) {
                    if (err) {
                        res.send(err);
                    }
                    else{
                        res.json({message: "OK", data: items});

                    }
                })
            }

            else if(req.query.skip && req.query.limit) {
                var skipnum = eval("("+req.query.skip+")");
                var limitnum = eval("("+req.query.limit+")");

                Item.find({}).skip(skipnum).limit(limitnum).exec(function (err, items) {
                    if (err) {
                        res.send(err);
                    }

                    else {
                        res.json({message: "OK", data: items});
                    }
                })
            }

            else if(req.query.count){
                var countbool = eval("("+req.query.count+")");
                Item.find({}).count(countbool).exec(function (err, items) {
                    if (err) {
                        res.send(err);
                    }

                    else{
                        res.json({message: "OK", data: items});
                    }
                })
            }

            else {
                Item.find(function (err, items) {
                    if (err) {
                        res.send(err);
                    }

                    else{
                        res.json({message: "OK", data: items});
                    }
                })
            }


        });

    router.route('/items/:item_id')
        .get(function (req, res) {
            Item.findById(req.params.item_id, function (err, items) {
                if(err) {
                    res.send(err);
                }

                else if(items == null){
                    res.status(404).json({message: "Item not found", data: []});
                }
                else{
                    res.json({message: "OK", data: items});
                }
            })

        })

        .put(function (req, res) {
          response = new Response();
          var new_item = new Item(req.body);
          // Convert to object
          new_item = new_item.toObject();
          // Remove _id field and dateCreated field since we do not want to modify that
          delete new_item._id;
          // Doing the update
          Item.findByIdAndUpdate(req.params.item_id, new_item, { new: true }, function(err, doc) {
            // Check for error
            if(err) {
                response.message = err.message;
                res.status(500).json(response);
              }
            else {
              response.message = "Item updated";
              response.data = doc;
              res.status(200).json(response);
            }
          });
        })

        .delete(function (req, res) {
            Item.remove({
                _id: req.params.item_id
            }, function (err, items) {
                if(err) {
                    res.status(500).json(err);
                }

                else if(items==null){
                    res.status(404).json({message: "Item not found", data:[]});
                }
                else{
                    res.json({message: 'Successfully deleted'});
                }
            });
        });

    return router;
}
