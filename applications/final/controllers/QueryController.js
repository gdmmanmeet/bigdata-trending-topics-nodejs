var zModel = require( '../models/Z' );
var settings = require('../index');
var messageModel = require( '../models/Message' );
var iirModel = require( '../models/IIR' );
var hybridModel = require( '../models/Hybrid' );

var querystring = require( 'querystring' );
var jade = require( 'jade' );

var templateDirectory = settings.templateDirectory;

var fetchTrends = function( segments, response, postData ) {
    if ( postData ) {
        response.writeHead( 200, { "content-type" : "application/json" } );
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
            case 'hybrid_approach' :
                var model = hybridModel;
        }
        model.fetchTrends( function( options ) {
            var tags = options['tags'];
            if( GLOBAL.keywordsDensity ) {
                var sortedKeywords =Object.keys( GLOBAL.keywordsDensity ).sort( function( c, d ){ return GLOBAL.keywordsDensity[ d ] - GLOBAL.keywordsDensity[ c ]; } ).splice(0, 10);
                var count = 0;
                for(var i = 0; i < tags.length; i ++ ) {
                    if ( sortedKeywords.indexOf( tags[i].text ) != -1 )
                        count ++;
                }
            }
            response.write( JSON.stringify( {
               'trending_tags': tags,
               'expected_tags' : sortedKeywords,
               'percentage_match' : count * 100 / (sortedKeywords? sortedKeywords.length : 1 ),
                'site_name': options['site_name'],
                'db_name': options['db_name']
            } ) );
            var currentTime = new Date().getTime() - options['request_time'];
            GLOBAL.performanceTagFetchTime = ( GLOBAL.performanceTagFetchTime * GLOBAL.performanceTagFetchTotal + currentTime ) / ( ++GLOBAL.performanceTagFetchTotal );
            response.end();
        }, {
            'db_name' : parsedData['db_name'],
            'site_name' : parsedData['site_name'],
            'approach' : approach,
            'request_time' : new Date().getTime()
        } );
    }
    else {
        response.writeHead( 404, { "content-type" : "text/html" } );
        response.write( "404 not found" );
        response.end();
    }
}

var fetchMessages = function( segments, response, postData ) {
    response.writeHead( 200, { "content-type" : "text/html" } );
    messageModel.fetchMessages( function( options ) {
        var messages = options['messages'];
        var html = jade.renderFile( templateDirectory + 'messages.jade', { 'messages' : messages } );
        response.write( html );
        var currentTime = new Date().getTime() - options['request_time'];
        GLOBAL.performanceMessageFetchTime = ( GLOBAL.performanceMessageFetchTime * GLOBAL.performanceMessageFetchTotal + currentTime ) / ( ++GLOBAL.performanceMessageFetchTotal );
        response.end();
    }, {
        'db_name' : segments[4],
        'site_name' : segments[5],
        'tag' : segments[6]
    } );
}

var performanceFactors = function( segments, response, postData ) {
    response.writeHead( 200, { 'content-type' : 'application/json' } );
    response.end( JSON.stringify( {
        'message_fetch_time': GLOBAL.performanceMessageFetchTime,
        'tag_fetch_time': GLOBAL.performanceTagFetchTime,
        'ram': GLOBAL.performanceRam
    }) );
}

exports.trends = fetchTrends;
exports.messages = fetchMessages;
exports.performance = performanceFactors;
