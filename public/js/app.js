var app = angular
            .module('mainApp', [
              'ngRoute' ,
              'appRoutes', 
              'toastr'
            ])
  .run([function () {
    console.log('app works');
  }]);