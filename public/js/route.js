var appRoutes  = angular.module('appRoutes',[]);

appRoutes.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/html-templates/home',
      controller: 'HomeController',
    })
}]);