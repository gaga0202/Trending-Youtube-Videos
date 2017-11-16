require('dotenv').load();

var express = require('express'),
    path    = require('path'),
    helmet  = require('helmet'),
    // version = require('./package.json').version,
    startMongodb = require('./config/start-mongodb'),
    port    = 3002;

var app = express();

startMongodb.connect();

// Set pug as view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Don't cache the remaining non-static things
app.use(helmet.noCache());

app.listen(port, function () {
  console.log('Server started at ' + port);
});

app.get('/api/test', function (req, res) {
  res.status(200).json({message: 'Hello the app is working'});
});

app.get('*', function (req, res) {
  res.locals.version = version;
})