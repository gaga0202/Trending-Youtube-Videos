app.controller('EditCountryController',[
'$scope', 'toastr', 'CountryService', '$routeParams', '$location',
function ($scope, toastr, CountryService, $routeParams, $location) {
  // ----------------------- Controller variables ------------------------------

  // -------------------------- Scope variables --------------------------------
  $scope.country = {};
  $scope.previousCode = $routeParams.countryCode;

  // -------------------------- Scope functions --------------------------------
  $scope.editCountry = editCountry;
  $scope.deleteCountry = deleteCountry;

  // ----------------------- Function Declaration ------------------------------
  function initialize() {
    var query = {
      page: 1,
      limit: 1,
      code: $scope.previousCode
    }
    CountryService.listCountries(query)
      .then(function (result) {
        if (result.data && result.data.countries.length === 0){
          toastr.error('Country not found', {timeout: 1500});
          $location.url('/list-countries');
        }
        $scope.country.code = result.data.countries[0].code;
        $scope.country.name = result.data.countries[0].name;
      })
      .catch(function (error) {
        toastr.error(error.data.message, {timeout: 1500});
      });
  }
  
  function editCountry() {
    if (!$scope.country.name){
      toastr.error('Please enter the country name', {timeout: 1500});
      return;
    }
    if (!$scope.country.code){
      toastr.error('Please enter the country code', {timeout: 1500});
      return;
    }
    var codes = {
      previousCode: $scope.previousCode,
      newCode:      $scope.country.code,
      newName:      $scope.country.name
    }
    CountryService
      .editCountry(codes)
      .then(function (result) {
        toastr.success(result.data.message, {timeout: 1500});
        $location.url('/list-countries');
      })
      .catch(function (error) {
        console.log(error);
        toastr.error(error.data.message, {timeout: 1500});
      });
  }

  function deleteCountry() {
    if (!$scope.previousCode) {
      torastr.error('Country not selected', {timeout: 1500});
    }
    CountryService.deleteCountry($scope.previousCode)
      .then(function (result) {
        toastr.success(result.data.message, {timeout: 1500});
        $location.url('/list-countries');
      })
      .catch(function (err) {
        toastr.error(err.data.message, {timeout: 1500});
      })
  }

  // ----------------------- Controller Work -----------------------------------
  initialize();
}]);