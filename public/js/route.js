var appRoutes  = angular.module('appRoutes',[]);

appRoutes.config(['$routeProvider', '$locationProvider', 
function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/html-templates/home',
      controller: 'HomeController'
    })
    .when('/add-country', {
      templateUrl: '/html-templates/country',
      controller: 'AddCountryController'
    })
    .when('/list-countries', {
      templateUrl:  '/html-templates/list-countries',
      controller:   'ListCountriesController'
    })
    .when('/edit-country/:countryCode', {
      templateUrl:  '/html-templates/edit-country',
      controller:   'EditCountryController'
    })
    .when('/video/:videoId', {
      templateUrl:    '/html-templates/watch-video',
      controller:     'WatchVideoController'
    })
    .otherwise({ redirectTo: '/' });

  //eliminate the hashbang
  $locationProvider.html5Mode(true);
}]);