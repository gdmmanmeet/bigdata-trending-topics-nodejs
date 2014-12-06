var settings = require('../index.js');
var templateDirectory = settings.templateDirectory;
var staticUrl = settings.staticUrl;

var jade = require('jade');

var fetchTrends = function( segments, response, postData ) {
    response.writeHead( 200, { "content-type" : "text/html" } );
    var html = jade.renderFile( templateDirectory + 'trends.jade', { 'staticUrl': staticUrl } );
    response.write( html );
    response.end();
}

exports.fetch_trends = fetchTrends;
