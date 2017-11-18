app.factory('CountryService', ['$http', function ($http) {
  return {
    addCountry: function (countryDetails) {
      return $http.post('/api/add-country', countryDetails);
    }
  }
}]);