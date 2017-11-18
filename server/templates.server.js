module.exports = {
  // home page
  home: function (req, res) {
    res.render('pages/home');
  },

  // add country page
  addCountry: function (req, res) {
    res.render('pages/country');
  },

  // List of countries and code
  listCountries: function (req, res) {
    res.render('pages/list-countries');
  },
}