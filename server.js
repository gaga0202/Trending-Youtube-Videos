require('dotenv').load();

var express           = require('express'),
    path              = require('path'),
    helmet            = require('helmet'),
    morgan            = require('morgan'),
    version           = require('./package.json').version,
    routes            = require('./server/routes'),
    startMongodb      = require('./config/start-mongodb'),
    port              = 3002;

var app = express();

/**
 * ============================ Start Mongodb ==================================
 */
startMongodb.connect();

/**
 * ============================ Routes =========================================
 */
routes(app);

/**
 * ===================== Set pug as view engine ================================
 */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Don't cache the remaining non-static things
app.use(helmet.noCache());

app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({extended: true})); //use bodyParser for request and parsing info
// app.use(bodyParser.json());
app.use(express.static( __dirname + '/public')); //use to serve static files like favicon, css, angular and the rest

app.listen(port, function () {
  console.log('Server started at ' + port);
});

/**
 * ===================== Attach Variables for front end ========================
 */
app.get('*', function (req, res) {
  res.locals.version = version;
  res.render('index');
})