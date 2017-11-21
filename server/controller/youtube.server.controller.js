var google = require('googleapis');
var youtubeApiKey = require('../../config/secrets').youtubeApiKey;
var CountryModel = require('../model/country.server.model');
var VideoModel  = require('../model/video.server.model')
var Promise = require('bluebird');
var _ = require('lodash');


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
        console.log('the country is ');
        console.log(country);
        if (!country) {
          throw new Error('Country not found');
        }
        getYoutubeVideos(regionCode);
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

// get trending videos of the region using its Code
function getYoutubeVideos(code){
  var youtube = google.youtube('v3');
  Promise.promisifyAll(youtube.videos);
  var pGetVideos = youtube.videos.listAsync({
      part:         'snippet, contentDetails',
      chart:        'mostPopular',
      maxResults:   25,
      regionCode:   code,
      key:          youtubeApiKey,
    });
  return pGetVideos
    .then(function (result) {
      console.log(result);
      var videos = result.items;
      var pSaveVideDetails = updateVideosAndTrend(videos, code);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// save and update Videos 
function updateVideosAndTrend(videos) {
  videos.forEach(function (video, key) {
    saveVideo(video);

  });
}

// create or update the video
function saveVideo(video) {
  VideoModel.findOne({
      videoId: video.id,
    })
    .then(function (vid) {
      if (!vid) {
        vid = new VideoModel();
        vid.videoId = video.id;
      }
      vid.title = video.snippet.title;
      vid.description = video.snippet.description;
      vid.channelId = video.snippet.channelId;
      vid.channelTitle = video.snippet.channelTitle;
      // vid.duration = video.contentDetails.duration;
    })
}

// Update the video id for the top trending videos for the region
function updateTrend(no, code, id){

}