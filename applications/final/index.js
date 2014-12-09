var handle = {};

handle['source'] = __dirname+'/controllers/DataSource.js';
handle['query'] = __dirname+'/controllers/QueryController.js';
handle['static'] = __dirname+'/controllers/StaticController.js';
handle['sink'] = __dirname+'/controllers/DataController.js';
handle['defaultController'] = __dirname + '/controllers/ApplicationController.js';

var APP_URL = '/final/';

exports.handle = handle;

exports.templateDirectory = __dirname+'/views/';
exports.staticDirectory = __dirname + '/static/';
exports.staticUrl = APP_URL+'static/file/';

exports.connection = require('../../connection.js').connection;
