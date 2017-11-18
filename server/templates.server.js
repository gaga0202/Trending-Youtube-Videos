module.exports = {
  // home page
  home: function (req, res) {
    res.render('pages/home');
  },

  // add country page
  country: function (req, res) {
    res.render('pages/country');
  }
}