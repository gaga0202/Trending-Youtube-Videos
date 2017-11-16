module.exports = function (app) {
  app.get('/api/test', function (req, res) {
    res.status(200).json({message: 'Hello the app is working'});
  });
}