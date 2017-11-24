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
    .otherwise({ 
      templateUrl: '/html-templates/home',
      controller:   'HomeController',
      resolve:      {
        pageNotFound:   pageNotFound
      }
     });

     function pageNotFound(toastr, $location) {
       toastr.error('Page not found', {timeout: 1500});
       $location.url('/');
     }

  //eliminate the hashbang
  $locationProvider.html5Mode(true);
}]);