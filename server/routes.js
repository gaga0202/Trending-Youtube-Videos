var Templates = require('./templates.server');

module.exports = function (app) {

  /**
   * ======================= Templates =========================================
   */
    app.get('/html-templates/home', Templates.home);
   /**
    * ======================= TEST ROUTE =======================================
    */
  app.get('/api/test', function (req, res) {
    res.status(200).json({message: 'Hello the app is working'});
  });
};