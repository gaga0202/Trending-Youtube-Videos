var Templates = require('./templates.server');
var Country = require('./controller/country.server.controller');
var Youtube = require('./controller/youtube.server.controller');

module.exports = function (app) {

  /**
   * ======================= Templates =========================================
   */

  app.get('/html-templates/home', Templates.home);
  app.get('/html-templates/country', Templates.addCountry);
  app.get('/html-templates/list-countries', Templates.listCountries);
  app.get('/html-templates/edit-country', Templates.editCountry);

  /**
  * ======================= TEST ROUTE =======================================
  */
  app.post('/api/add-country', Country.addCountry);
  app.get('/api/country', Country.getAll);
  app.get('/api/list-countries', Country.listCountries);
  app.delete('/api/country/:countryCode', Country.deleteCountry);
  app.put('/api/edit-country/:previousCode', Country.editCountry);

  /**
  * ================== Youtube and Video ROUTE =================================
  */
  app.post('/api/youtubeTrendingVideos', Youtube.trendingVideos);
  app.get('/api/video/:videoId', Youtube.getVideoDetails);
  app.get('/api/watch-more/:videoId', Youtube.watchMore);
};