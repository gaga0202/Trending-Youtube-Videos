app.controller('AddCountryController',['$scope', 'toastr', 'CountryService',
function ($scope, toastr, CountryService) {
  // ----------------------- Controller variables ------------------------------
  // -------------------------- Scope variables --------------------------------
  $scope.country = {};
  // -------------------------- Scope functions --------------------------------
  $scope.addCountry = addCountry;
  // ----------------------- Function Declaration ------------------------------
  function addCountry() {
    if (!$scope.country.name){
      toastr.error('Please enter the country name', {timeout: 1500});
      return;
    }
    if (!$scope.country.code){
      toastr.error('Please enter the country code', {timeout: 1500});
      return;
    }
    CountryService
      .addCountry($scope.country)
      .then(function (result) {
        toastr.success(result.data.message, {timeout: 1500});
      })
      .catch(function (error) {
        toastr.error(error.data.message, {timeout: 1500});
      })
  }
}]);