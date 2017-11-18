var appRoutes  = angular.module('appRoutes',[]);

appRoutes.config(['$routeProvider', '$locationProvider', 
function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/html-templates/home',
      controller: 'HomeController'
    })
    .otherwise({ redirectTo: '/' });

  //eliminate the hashbang
  $locationProvider.html5Mode(true);
}]);