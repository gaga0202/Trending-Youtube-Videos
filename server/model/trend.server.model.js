
var mongoose = require('mongoose');
var trendSchema = mongoose.Schema({
  countryCode:         { type: String, required: true },
  videoId:             { type: String, required: true },
  trendNo:             { type: Number },
});

module.exports = mongoose.model('Trend', trendSchema, 'Trends');