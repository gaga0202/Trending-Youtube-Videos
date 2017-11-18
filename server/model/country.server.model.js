
var mongoose = require('');
var countrySchema = mongoose.schema({
  code:         { type: String, unique: true},
  name:         { type: String},
});

module.exports = mongoose.model('Country', countrySchema, 'Countries');