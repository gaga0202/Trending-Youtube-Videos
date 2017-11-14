var express = require('express'),
    path    = require('path'),
    port    = 3002;

var app = express();

// Set pug as view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, function () {
  console.log('Server started at ' + port);
});

app.get('/api/test', function (req, res) {
  res.status(200).json({message: 'Hello the app is working'});
});