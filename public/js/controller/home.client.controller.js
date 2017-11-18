app.controller('HomeController',['$scope', '$http', 'toastr', function ($scope, $http, toastr) {
  $http.get('/api/test')
    .then(function (result) {
      toastr.success(result.data.message, {timeout: 1500});
      $scope.test = result.data.message;
    })
    .catch(function (error) {
      toastr.error(error.data.message, {timeout: 1500});
    });
}]);