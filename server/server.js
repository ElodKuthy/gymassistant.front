/**
 * Module dependencies
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    routes = require('./routes'),
    https = require('https'),
    path = require('path'),
    fs = require('fs');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

/**
 * Routes
 */

var options = {
    key: fs.readFileSync(__dirname + "/ssl/key.pem"),
    cert: fs.readFileSync(__dirname + "/ssl/cert.pem")
};

// serve index and view partials
app.get('/', routes.index);
app.get('/:dir/:name.html', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

https.createServer(options, app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
