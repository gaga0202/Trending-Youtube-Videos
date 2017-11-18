app.controller('ListCountriesController',['$scope', 'toastr', 'CountryService',
function ($scope, toastr, CountryService) {
  // ----------------------- Controller variables ------------------------------
  var limit = 25;

  // -------------------------- Scope variables --------------------------------
  $scope.countries = [];
  $scope.page = 1;

  // -------------------------- Scope functions --------------------------------
  

  // ----------------------- Function Declaration ------------------------------
  function initialize() {
    
  }
}]);