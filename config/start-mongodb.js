var mongoose   = require('mongoose'),
    secrets    = require('./secrets');

var db = mongoose.connection;
mongoose.connect(secrets.productionDb);

module.exports = {
  connect: function() {
    db.on('error', console.error.bind( console, 'MongoDB Connection Error. Please make sure that MongoDB is running.'));
    db.once('open', function() {
      console.log('Trending youtube videos db opened');
    });
  }
};