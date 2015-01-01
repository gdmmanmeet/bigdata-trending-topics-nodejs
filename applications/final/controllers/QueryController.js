var zModel = require( '../models/Z' );
var settings = require('../index');
var messageModel = require( '../models/Message' );
var iirModel = require( '../models/IIR' );

var querystring = require( 'querystring' );
var jade = require( 'jade' );

var templateDirectory = settings.templateDirectory;

var fetchTrends = function( segments, response, postData ) {
    if ( postData ) {
        response.writeHead( 200, { "content-type" : "text/html" } );
        var parsedData = querystring.parse( postData );
        var dbName = parsedData['db_name'];
        var siteName = parsedData['site_name'];
        var approach = parsedData['approach'];
        switch( approach ) {
            case 'z_approach' :
                var model = zModel;
                break;
            case 'iir_approach' :
                var model = iirModel;
                break;
        }
        model.fetchTrends( function( options ) {
            var tags = options['tags'];
            var html = jade.renderFile( templateDirectory + 'trends.jade', {
                'tags' : tags,
                'db_name' : dbName,
                'site_name' : siteName,
                'approach' : options['approach']
            } );
            response.write( html );
            response.end();
        }, {
            'db_name' : parsedData['db_name'],
            'site_name' : parsedData['site_name'],
            'approach' : approach
        } );
    }
    else {
        response.writeHead( 404, { "content-type" : "text/html" } );
        response.write( "404 not found" );
        response.end();
    }
}

exports.trends = fetchTrends;
