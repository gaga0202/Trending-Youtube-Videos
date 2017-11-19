app.controller('ListCountriesController',['$scope', 'toastr', 'CountryService',
function ($scope, toastr, CountryService) {
  // ----------------------- Controller variables ------------------------------
  var limit = 25;

  // -------------------------- Scope variables --------------------------------
  $scope.countries = [];
  $scope.page = 1;
  $scope.finished = false;

  // -------------------------- Scope functions --------------------------------
  

  initialize();
  // ----------------------- Function Declaration ------------------------------
  function initialize() {
    var getData = {
      page:   $scope.page,
      limit:  limit
    };
    if (!$scope.finished) {
      CountryService.listCountries(getData)
      .then(function (result) {
        result.data.countries.forEach(function (country) {
          $scope.countries.push(country);
        })
        if (!result.data.next) {
          $scope.finished = true;
        }
      })
      .catch(function (error) {
        toastr.error(error.data.message, {timeout: 1500});
      });
    }
  }
}]);