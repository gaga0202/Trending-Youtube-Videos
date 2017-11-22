app.controller('HomeController',['$scope', '$http', 'toastr', '$routeParams',
'CountryService', 'TrendService', 
function ($scope, $http, toastr, $routeParams, CountryService, TrendService) {
  // ----------------------- Controller variables ----------------------------
  var countryCode = $routeParams.code;

  // -------------------------- Scope variables ------------------------------
  $scope.country = {};

  // -------------------------- Scope functions ------------------------------
  // $scope.addCountry = addCountry;

  // ----------------------- Function Declaration ----------------------------
  function initialize() {
    var pCountryList = CountryService.getAll();
    var pTrendingList;
    if (countryCode) {
      pTrendingList = TrendService.getTrend(countryCode);
    } else {
      pTrendingList = TrendService.getTrend('AU');
    }
    Promise.all([pCountryList, pTrendingList])
      .then(function (resultArray) {
        $scope.countries = resultArray[0].data.countries;
        $scope.trendingVideos = resultArray[1].data.trendingVideos;
      })
      .catch(function (errorArray) {
        console.log(errorArray);
      });
  }

  // ----------------------- Controller Operations ----------------------------
  initialize();
}]);