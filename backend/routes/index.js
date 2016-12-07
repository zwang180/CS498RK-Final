/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
  app.use('/api', require('./users.js')(router));
  app.use('/api', require('./reviews.js')(router));
  app.use('/api', require('./stores.js')(router));
  app.use('/api', require('./items.js')(router));
  app.use('/api', require('./home.js')(router));
};
