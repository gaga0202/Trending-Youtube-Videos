var google          = require('googleapis');
var youtubeApiKey   = require('../../config/secrets').youtubeApiKey;
var CountryModel    = require('../model/country.server.model');
var VideoModel      = require('../model/video.server.model');
var TrendModel      = require('../model/trend.server.model');
var Promise         = require('bluebird');
var _               = require('lodash');
var moment          = require('moment');


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
        return getYoutubeVideos(regionCode);
      })
      .then(function () {
        return res.status(201).json({
          message:    'Trending videos imported',
        });
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
      part:         'snippet, contentDetails, statistics',
      chart:        'mostPopular',
      maxResults:   25,
      regionCode:   code,
      key:          youtubeApiKey,
    });
  return pGetVideos
    .then(function (result) {
      var videos = result.items;
      console.log(videos);
      var pSaveVideDetails = updateVideosAndTrend(videos, code);
      return pSaveVideDetails
          .then(function (_result) {
            return;
          })
          .catch(function (error) {
            throw error;
          });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// save and update Videos 
function updateVideosAndTrend(videos, code) {
  var promiseArray = [];
  videos.forEach(function (video, key) {
    var pSaveVideo = saveVideo(video);
    var pUpdateTrend = updateTrend(key, code, video.id);
    promiseArray.push(pSaveVideo);
    promiseArray.push(pUpdateTrend);
  });
  return Promise.all(promiseArray);
}

// create or update the video
function saveVideo(video) {
  return VideoModel.findOne({
      videoId: video.id,
    })
    .then(function (vid) {
      if (!vid) {
        vid = new VideoModel();
        vid.videoId = video.id;
      }
      vid.title               = video.snippet.title;
      vid.description         = video.snippet.description;
      vid.channelId           = video.snippet.channelId;
      vid.channelTitle        = video.snippet.channelTitle;
      vid.duration = moment.duration(video.contentDetails.duration).asSeconds();
      vid.thumbnailUrl        = getBestThumbnailUrl(video.snippet.thumbnails);
      vid.timePublished       = video.snippet.publishedAt;
      vid.reactions.likes     = video.statistics.likeCount;
      vid.reactions.dislikes  = video.statistics.dislikeCount;
      vid.views               = video.statistics.viewCount;
      return vid.save();
    })
    .catch(function (error) {
      throw error;
    })
}

// Update the video id for the top trending videos for the region
function updateTrend(no, code, id){
  return TrendModel.findOne({
      countryCode: code,
      trendNo:     no,
    })
    .then(function (trend) {
      console.log('the trend is ');
      console.log(trend);
      if (!trend) {
        trend = new TrendModel();
        trend.countryCode = code;
        trend.trendNo     = no;
      }
      trend.videoId = id;
      console.log('the trend after is  ');
      console.log(trend);
      return trend.save();
    })
    .catch(function (error) {
      throw error;
    });
}

// return the best thumbnailurl out of all the urls
function getBestThumbnailUrl(thumbnail) {
  var maxWidth = 0;
  var optionToSelect;
  _.forEach(thumbnail, function (value, key) {
    if (value.width > maxWidth){
      optionToSelect = key;
      maxWidth = value.width;
    }
  });
  return thumbnail[optionToSelect].url;
}