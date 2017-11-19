app.factory('CountryService', ['$http', function ($http) {
  return {
    // To add new country
    addCountry: function (countryDetails) {
      return $http.post('/api/add-country', countryDetails);
    },

    // Get list of all countries
    listCountries: function (query) {
      var url = '/api/list-countries?'
      if (query.page) {
        url = url + 'page=' + query.page;
      } else {
        url = url + 'page=' + 1;
      }
      if (query.limit) {
        url = url + '&limit=' + query.limit;
      } else {
        url = url + '&limit=' + 25;
      }
      return $http.get(url);
    },

    // Delete Country from db
    deleteCountry: function (code) {
      return $http.delete('/api/country/' + code);
    }
  }
}]);