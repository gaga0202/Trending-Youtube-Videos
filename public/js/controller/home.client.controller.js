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
    CountryService.getAll()
      .then(function (result) {
        $scope.country.countries = result.data.countries;
      })
      .catch(function (error) {
        toastr.error(error.data.message, {timeOut: 1500});
      })

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
        var code = angular.element(document.getElementById('image'));
        console.log(code);
      })
      .catch(function (error) {
        toastr.error(errorArray.data.message, {timeOut: 1500});
      });
  }

  function getTrendForCountry() {
    $location.url('/?code=' + $scope.country.code);
  }
  // ----------------------- Controller Operations ----------------------------
  initialize();
}]);