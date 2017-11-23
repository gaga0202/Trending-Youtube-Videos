app.controller('HomeController',['$scope', '$location', 'toastr', '$routeParams',
'CountryService', 'TrendService', 
function ($scope, $location, toastr, $routeParams, CountryService, TrendService) {
  // ----------------------- Controller variables ----------------------------
  var countryCode = $routeParams.code;

  // -------------------------- Scope variables ------------------------------
  $scope.country = {};
  $scope.getTrendForCountry = getTrendForCountry;
  // -------------------------- Scope functions ------------------------------
  // $scope.addCountry = addCountry;

  // ----------------------- Function Declaration ----------------------------
  function initialize() {
    var pTrendingList; 
    if (countryCode) {
      pTrendingList = TrendService.getTrend(countryCode);
    } else {
      pTrendingList = TrendService.getTrend('AU');
    }
    pTrendingList
      .then(function (result) {
        $scope.trendingVideos = result.data.trendingVideos;
        $scope.country.countryName = result.data.countryName;
        $scope.country.countryCode = result.data.countryCode;
      })
      .catch(function (error) {
        toastr.error(error.data.message, {timeOut: 1500});
      });
  }

  function getTrendForCountry() {
    $location.url('/?code=' + $scope.country.countryCode);
  }
  // ----------------------- Controller Operations ----------------------------
  CountryService.getAll()
  .then(function (result) {
    $scope.country.countries = result.data.countries;
    initialize();
  })
  .catch(function (error) {
    toastr.error(error.data.message, {timeOut: 1500});
  })
}]);