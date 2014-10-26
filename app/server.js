'use strict';

(function () {

    var express    = require('express');
    var app        = express();
    var bodyParser = require('body-parser');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    var port = process.env.PORT || 9000;

    var router = express.Router();

    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    app.use('/api', router);

    app.listen(port);
    console.log('Server running at port ' + port);

})();
