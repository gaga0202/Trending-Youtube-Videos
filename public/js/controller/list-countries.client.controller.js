app.controller('ListCountriesController',[
  '$scope', 'toastr', 'CountryService','$interval', '$location',
function ($scope, toastr, CountryService, $interval, $location) {
  // ----------------------- Controller variables ------------------------------
  var limit = 5;
  var intervals = [];
  var loadMoreInterval;
  var waitingOnLoadMore = false;

  // -------------------------- Scope variables --------------------------------
  $scope.countries = [];
  $scope.page = 1;
  $scope.initialized = false;
  $scope.finished = false;

  // -------------------------- Scope functions --------------------------------
  $scope.loadMore = loadMore;
  $scope.deleteClicked = deleteClicked;

  // ----------------------- Function Declaration ------------------------------
  function loadMore() {
    waitingOnLoadMore = true;
    if ($scope.initialized) {
      $scope.page = $scope.page + 1;
    }
    $scope.initialized = true;
    var getData = {
      page:   $scope.page,
      limit:  limit
    };
    if (!$scope.finished) {
      return CountryService.listCountries(getData)
        .then(function (result) {
          result.data.countries.forEach(function (country) {
            $scope.countries.push(country);
          })
          if (!result.data.next) {
            $scope.finished = true;
          }
          waitingOnLoadMore = false;
        })
        .catch(function (error) {
          toastr.error(error.data.message, {timeout: 1500});
          waitingOnLoadMore = false;
        });
    }
  }

  function deleteClicked(code) {
    if (!code) {
      torastr.error('Country not selected', {timeout: 1500});
    }
    CountryService.deleteCountry(code)
      .then(function (result) {
        toastr.success(result.data.message, {timeout: 1500});
        $scope.page = 1;
        $scope.countries = [];
        $scope.initialized = false;
        $scope.finished = false;
        intervals = [];
        loadMoreInterval;
        waitingOnLoadMore = false;
        $scope.loadMore();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // ------------------------ Controller Work ----------------------------------

  $scope.loadMore()
    .then(function (){
      // check every so often to see if we should load more
      if (intervals.length === 0){
        loadMoreInterval = $interval(function(){ 
              var bufferSize = 600;
              var body = document.body;
              var yPos = window.pageYOffset;
              var windowHeight = window.innerHeight;
              if (!waitingOnLoadMore
                  && windowHeight +yPos > body.scrollHeight - bufferSize
                  && !$scope.finished) {
                $scope.loadMore();
              } 
            }, 200);
        intervals.push(loadMoreInterval);
        }
    });

  $scope.$on('$destroy', function() {
    // Make sure that the interval is destroyed too
    $interval.cancel(loadMoreInterval);
    loadMoreInterval = undefined;
  });
}]);