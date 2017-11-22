app.factory('TrendService', ['$http', function ($http) {
  return {
    // To add new country
    getTrend: function (code) {
      return $http.post('/api/youtubeTrendingVideos', {code: code});
    },
  }
}]);