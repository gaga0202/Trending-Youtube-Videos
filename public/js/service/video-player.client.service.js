app.factory('VideoPlayer', ['$http', 
function($http) {
  return {
    youtubePlayer: function (resourceId) {
      var player;
      function onYouTubePlayerAPIReady(resourceId) {
        player = new YT.Player('main-video', {
          videoId: resourceId,
          playerVars: { 
            'autoplay': 1 , 
            'rel': 0 ,
            'showinfo': 0
          }, 
        });
      }
      onYouTubePlayerAPIReady(resourceId);
    }
  }
}]);