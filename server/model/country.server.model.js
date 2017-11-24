
var mongoose = require('mongoose');
var countrySchema = mongoose.Schema({
  code:         { type: String, unique: true, lowercase: true},
  name:         { type: String},
});

module.exports = mongoose.model('Country', countrySchema, 'Countries');