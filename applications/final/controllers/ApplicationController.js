var jade = require( 'jade' );
var settings = require('../index.js');
var templateDirectory = settings.templateDirectory;
var staticUrl = settings.staticUrl;

var index = function( segments, response, postData ){
    response.writeHead( 200, { "content-type" : "text/html" } );
    var html = jade.renderFile( templateDirectory + "index.jade", { "staticUrl" : staticUrl } );
    response.write( html );
    response.end();
};

var dashboard = function( segments, response, postData ){
    response.writeHead( 200, { "content-type" : "text/html" } );
    var html = jade.renderFile( templateDirectory + "dashboard.jade", { "staticUrl" : staticUrl } );
    response.write( html );
    response.end();
};

exports.index = index;
exports.dashboard = dashboard;
