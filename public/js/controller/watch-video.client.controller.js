angular.controller('WatchVideoController',[
'$scope', '$location', 'TrendService',
function ($scope, $location, TrendService) {
  
  //===================== Variable Initialization ==============================
  var page = 1;

  // ======================== Scope Variables ==================================
  $scope.videoId = $routeParams.videoId;

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
        console.log(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function watchMore(page) {
    var details = {
      page:       page,
      videoId:    $scope.videoId,
    };
    TrendService.watchMore(details)
      .then(function (result) {
        console.log(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // ==================== Controller Functionality =============================


}]);