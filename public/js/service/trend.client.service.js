app.factory('TrendService', ['$http', function ($http) {
  return {
    // To add new country
    getTrend: function (code) {
      return $http.post('/api/youtubeTrendingVideos', {code: code});
    },

    // Get the details to play the video
    getVideoDetails: function (videoId) {
      return $http.get('/api/video/' + videoId);
    },

    // Get 3 suggestions Video
    watchMore:  function (details) {
      return $http.get('/api/watch-more/' + details.videoId 
          + '?page=' + details.page);
    }
  }
}]);