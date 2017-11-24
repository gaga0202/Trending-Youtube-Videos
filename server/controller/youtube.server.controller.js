var google          = require('googleapis');
var youtubeApiKey   = require('../../config/secrets').youtubeApiKey;
var CountryModel    = require('../model/country.server.model');
var VideoModel      = require('../model/video.server.model');
var TrendModel      = require('../model/trend.server.model');
var Promise         = require('bluebird');
var _               = require('lodash');
var moment          = require('moment');


module.exports = {
  /**
   * Get top 25 trending videos of a country
   */
  trendingVideos: function (req, res) {
    var regionCode = req.body.code.toLowerCase();
    var country;
    if (!regionCode) {
      return res.status(400).json({
        message:  'Please select the country',
      });
    }
    CountryModel.findOne({code: regionCode})
      .then(function (c) {
        country = c;
        if (!country) {
          throw new Error('Country not found');
        }
        return getYoutubeVideos(regionCode);
      })
      .then(function (_result) {
        var resultObject = getTopTrendingVideosForCountry(regionCode);
        return resultObject;
      })
      .then(function (trendingObject) {
        return res.status(201).json({
          message:          'Trending videos imported',
          trendingVideos:   trendingObject,
          countryName:      country.name,
          countryCode:      country.code,
        });
      })
      .catch(function (error) {
        console.log(error);
        if (error.message === 'Country not found') {
          return res.status(404).json({
            message: 'Please enter valid country code',
          });
        } else {
          return res.status(500).json({
            message:  error.message,
          });
        }
      });
  },


  /**
   * Get all the video details for the videoId
   */
  getVideoDetails:  function (req, res) {
    var videoId = req.params.videoId;
    VideoModel.findOne({videoId: videoId})
      .then(function (video) {
        if (!video) {
          throw new Error('404');
        }
        return res.status(200).json({
          message:    'Video details attached',
          video:    video,
        });
      })
      .catch(function (error) {
        if (error.message === '404') {
          return res.status(404).json({
            message:    'Video not found',
          });
        }
      });
  },

  /**
   * Watch more suggestions on video page
   */
  watchMore: function (req, res) {
    var videoId = req.params.videoId;
    var page = parseInt(req.query.page);
    if (!page){
      page = 1;
    }
    var limit = 3;
    if (page * limit >= 25) {
      page = Math.ceil(24/limit);
    }
    TrendModel.findOne({ videoId: videoId })
      .then(function (trendResult) {
        if (!trendResult) {
          throw new Error('404');
        }
        var pipe = [
          {$match:  {
            countryCode:  trendResult.countryCode,
            $nor:      [{videoId:  videoId}],
          }},
          {$sort: {trendNo: 1}},
          {$skip: (page - 1) * limit},
          {$limit:  limit},
          {$group: {
            _id:          '$videoId',
            trendingNo:   {$first:  '$trendNo'},
          }},
        ];
        return TrendModel.aggregate(pipe);
      })
      .then(function (trendYoutubeId) {
        var pArray = [];
        _.forEach(trendYoutubeId, function (vidTrend) {
          var pGetVideos = getVideos(vidTrend);
          pArray.push(pGetVideos);
        });
        return Promise.all(pArray);
      })
      .then(function (pArray) {
        var trendingArray = _.sortBy(pArray, 'trendingNo');
        var previousPage, nextPage;
        if (page * limit >= 24) {
          nextPage = 1;
        } else {
          nextPage = page + 1;
        }
        if (page === 1) {
          previousPage = Math.ceil(24/limit);
        } else {
          previousPage = page - 1;
        }
        return res.status(200).json({
          message:        'Watch more',
          videos:         trendingArray,
          nextPage:       nextPage,
          previousPage:   previousPage,
        });
      })
      .catch(function (error) {
        if (error.message === '404') {
          return res.status(404).json({
            message:      'Trend not found',
          });
        } else {
          return res.status(500).json({
            message:      error.message,
          });
        }
      });
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
      throw error;
    });
}

// save and update Videos 
function updateVideosAndTrend(videos, code) {
  var promiseArray = [];
  videos.forEach(function (video, key) {
    var pSaveVideo = saveVideo(video);
    var pUpdateTrend = updateTrend((key + 1), code, video.id);
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
    });
}

// Update the video id for the top trending videos for the region
function updateTrend(no, code, id){
  return TrendModel.findOne({
      countryCode: code,
      trendNo:     no,
    })
    .then(function (trend) {
      if (!trend) {
        trend = new TrendModel();
        trend.countryCode = code;
        trend.trendNo     = no;
      }
      trend.videoId = id;
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

// get the trenging videos for the country
function getTopTrendingVideosForCountry(code) {
  var pGetVideoIdsForCountry = getVideoIdsForCountry(code);
  return pGetVideoIdsForCountry
    .then(function (trendYoutubeId) {
      var pArray = [];
      _.forEach(trendYoutubeId, function (vidTrend) {
        var pGetVideos = getVideos(vidTrend);
        pArray.push(pGetVideos);
      });
      return Promise.all(pArray);
    })
    .then(function (pArray) {
      var trendingArray = _.sortBy(pArray, 'trendingNo');
      return trendingArray;
    })
    .catch(function (error) {
      throw error;
    });
}

// get videoIds for this country
function getVideoIdsForCountry(code) {
  var pipe = [
    { $match: {
      countryCode: code,
    }},
    // Sort them by newest first
    { $sort: { trendNo: 1 } },
    // Group the videos by channels
    { $group: {
      _id: '$videoId',
      trendingNo: { $first: '$trendNo' },
    }},
  ];
  return TrendModel.aggregate(pipe)
    .then(function (result) {
      return result;
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
}


function getVideos(vidTrend) {
  return VideoModel.findOne({videoId: vidTrend._id})
    .then(function (video) {
      var result = {
        video:        video,
        trendingNo:   vidTrend.trendingNo,
      };
      return result;
    })
    .catch(function (error) {
      throw error;
    });
}