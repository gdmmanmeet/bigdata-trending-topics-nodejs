var zModel = require( '../models/Z' );
var settings = require('../index.js');
var querystring = require( 'querystring' );

var templateDirectory = settings.templateDirectory;

var jade = require('jade');

var fetchTrends = function( segments, response, postData ) {
    if ( postData ) {
        response.writeHead( 200, { "content-type" : "text/html" } );
        var parsedData = querystring.parse( postData );
        var dbName = parsedData['db_name'];
        var siteName = parsedData['site_name'];
        zModel.fetchTrends( function( options ) {
            var tags = options['tags'];
            var html = jade.renderFile( templateDirectory + 'trends.jade', {
                'tags' : tags,
                'db_name' : dbName,
                'site_name' : siteName
            } );
            response.write( html );
            response.end();
        }, {
            'db_name' : parsedData['db_name'],
            'site_name' : parsedData['site_name']
        } );
    }
    else {
        response.writeHead( 404, { "content-type" : "text/html" } );
        response.write( "404 not found" );
        response.end();
    }
}

exports.trends = fetchTrends;
