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
      if (query.code) {
        url = url + '&code=' + query.code;
      }
      if (query.fromListCountries){
        url = url + '&fromListCountries=' + true;
      }
      return $http.get(url);
    },

    getAll: function () {
      return $http.get('/api/country');
    },

    // Delete Country from db
    deleteCountry: function (code) {
      return $http.delete('/api/country/' + code);
    },

    editCountry: function (codes) {
      return $http.put('/api/edit-country/' + codes.previousCode, codes);
    }
  }
}]);