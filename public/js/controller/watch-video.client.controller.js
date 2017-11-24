app.controller('WatchVideoController',[
'$scope', '$location', 'TrendService', '$routeParams', 'VideoPlayer', 'toastr',
function ($scope, $location, TrendService, $routeParams, VideoPlayer, toastr) {
  
  //===================== Variable Initialization ==============================
  var page = 1;

  // ======================== Scope Variables ==================================
  $scope.videoId = $routeParams.videoId;
  $scope.video;

  // ======================== Scope Functions ==================================

  // ====================== Function Decleration ===============================
  function initialize () {
    var page = 1;
    getVideoDetails();
    watchMore(page);
  }

  function getVideoDetails() {
    TrendService.getVideoDetails($scope.videoId)
      .then(function (result) {
        $scope.video = result.data.video;
        console.log($scope.video);
        var externalSource = {
          source:     'youtube',
          url:        'www.youtube.com/watch?v=' + $scope.video.videoId
        };
        var player = VideoPlayer.videoJSPlayer('main-video', externalSource);
      })
      .catch(function (error) {
        console.log(error);
        toastr.error(error.data.message, {timeout: 1500});
        if (error.status === 404) {
          $location.url('/');
        } 
      });
  }

  function watchMore(page) {
    var details = {
      page:       page,
      videoId:    $scope.videoId,
    };
    TrendService.watchMore(details)
      .then(function (result) {
        console.log(result.data);
        $scope.videos = result.data.videos;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // ==================== Controller Functionality =============================
  initialize();

}]);