var Templates = require('./templates.server');
var Country = require('./controller/country.server.controller');

module.exports = function (app) {

  /**
   * ======================= Templates =========================================
   */

  app.get('/html-templates/home', Templates.home);
  app.get('/html-templates/country', Templates.country);

  /**
  * ======================= TEST ROUTE =======================================
  */
  app.post('/api/add-country', Country.addCountry);
};