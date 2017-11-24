app.factory('VideoPlayer', ['$http', 
function($http) {
  return {
    defaultOptions: function () {
      return {
        controls: true,
        preload: 'metadata',
        autoplay: true,
        playsinline: true,
        playbackRates: [0.5, 1, 1.5, 2, 3]
      };
    },

    videoJSPlayer: function (elementTag, extSource, options, callback) {
      if (typeof options === 'undefined') {
        // Default video js options
        options = this.defaultOptions();
      }
      
      if (typeof extSource !== 'undefined') {
        options.techOrder = [extSource.source],
        options.sources = [{'type': ('video/' + extSource.source), 'src': extSource.url}];
      }

      if (typeof callback === 'undefined') {
        callback = function() {
          // Defaults to empty callback
        };
      }

      return videojs(elementTag, options, callback);
    }
  }
}]);