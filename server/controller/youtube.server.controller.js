var google = require('googleapis');
var youtubeApiKey = require('../../config/secrets').youtubeApiKey;
var CountryModel = require('../model/country.server.model');

module.exports = {
  trendingVideos: function (req, res) {
    var regionCode = req.body.code;
    if (!regionCode) {
      return res.status(400).json({
        message:  'Please select the country',
      });
    }
    CountryModel.find({code: regionCode})
      .then(function (country) {
        if (!country) {
          throw new Error('Country not found');
        }

      })
      .catch(function (error) {
        console.log(error);
        if (error.message === 'Country not found') {
          return res.status(404).json({
            message: 'Please enter valid country code',
          });
        }
      })
  },
};

function getYoutubeVideos(code){
  var youtube = google.youtube('v3');
  
}