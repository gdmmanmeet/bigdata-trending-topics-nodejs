var querystring = require('querystring');
var cron = require( 'cron' );
var zModel = require( '../models/Z' );
var messagesModel = require('../models/Message');
var iirModel = require( '../models/IIR');
var hybridModel = require( '../models/Hybrid' );

var handledata = function( segments, response, postData ){
   if (postData){
       response.writeHead(200, { "content-type" : "text/html" } );
       var parsedData = querystring.parse(postData);
       var messages = JSON.parse(parsedData['messages']);
       var options = {
           'db_name' : parsedData['db_name'],
           'site_name' : parsedData['site_name'],
           'messages' : messages,
           'request_time' : new Date().getTime()
       };
       var tags = [];
       messages.forEach(function(tweet){
           tweet.hashtags = tweet.hashtags.map( function( hashtag ) {
               hashtag = hashtag.toLowerCase();
               tags.push( { "text" : hashtag } );
               return hashtag;
           });
       });
       options['tags'] = tags;
       switch( parsedData['approach'] ) {
           case 'z_approach' :
               zModel.store( storeMessages, options );
               break;
           case 'iir_approach' :
               iirModel.store( storeMessages, options );
               break;
            case 'hybrid_approach' :
               hybridModel.store( storeMessages, options );
       }
       response.end();
   }
   else{
      response.writeHead( 404, { "content-type" : "text/html" } );
      response.write(" 404 not found");
      response.end();
   }
}

var storeMessages = function( options ){
    messagesModel.store(function( options ){
        var currentTime = new Date().getTime() - options['storage_time'];
        GLOBAL.performanceStorageTime = ( GLOBAL.performanceStorageTime * GLOBAL.performanceStorageTimeTotal + currentTime ) / ( ++GLOBAL.performanceStorageTimeTotal );
    },options);
}

var setCron = function( segments, response, postData ) {
    if ( postData ) {
        response.writeHead( 200, { "Content-Type" : "text/html" } );
        var parsedData = querystring.parse( postData );
        console.log( parsedData['score_rate']);
        if ( !GLOBAL.dataControllerCron ) {
            GLOBAL.dataControllerCron = new cron.CronJob ( '1 */' + parsedData['score_rate'] +' * * * *', function() {
                console.log('\n\n\n\n ******** cron started *********\n\n\n\n');
                switch( parsedData['approach'] ) {
                    case 'z_approach' :
                        zModel.fetchAll( updateZValues, parsedData );
                        break;
                    case 'iir_approach' :
                        iirModel.fetchAll( updateIIRValues, parsedData );
                        break;
                    case 'hybrid_approach' :
                        hybridModel.fetchAll( updateHybridValues, parsedData );
                }
            }, null, true );
            GLOBAL.dataControllerCron.start();
        }
        else
        {
            newCronTime = new cron.CronTime( '1 */' + parsedData['score_rate'] + ' * * * *' );
            GLOBAL.dataControllerCron.setTime( newCronTime );
            GLOBAL.dataControllerCron.start();
        }
        response.end();
    }
    else {
        response.writeHead( 404, { "Content-Type" : "text/html" } );
        response.write( "404 not found" );
        response.end();
    }
}

var updateZValues = function( options ) {
    var scores = options[ 'scores' ];
    scores.forEach( function( score ) {
        if ( score['mean'] ) {
            score[ 'mean' ] = ( score.total * score.mean + score.count )/( score.total + 1 );
            score[ 'variance' ] = Math.sqrt( ( score.total * score.variance * score.variance + score.count * score.count ) / ( score.total + 1 ) );
            score[ 'total' ]++;
            score[ 'z-score' ] = ( score.count - score['mean' ] ) / score.variance + 10000;
            score['count'] = 0;
            zModel.upsert( function(){}, {
                "db_name" : options['db_name'],
                "site_name" : options['site_name'],
                "score" : score
            } );
        }
        else {
            score['mean'] = score.count;
            score['variance'] = score.count;
            score['total'] = 1;
            score['z-score'] = 10000;
            score['count']=0;
            zModel.upsert( function(){}, {
                'db_name' : options['db_name'],
                'site_name' : options['site_name'],
                'score' : score
            } );
        }
    });
}

var updateIIRValues = function( options ) {
    var scores = options[ 'scores' ];
    scores.forEach( function( score ) {
        if ( score['iir-score'] ) {
            score['iir-score'] = score.count * 0.7 + score['iir-score']*0.3;
            score['count'] = 0;
            iirModel.upsert( function(){}, {
                "db_name" : options['db_name'],
                "site_name" : options['site_name'],
                "score" : score
            } );
        }
        else {
            score['iir-score'] = score.count;
            score['count']=0;
            iirModel.upsert( function(){}, {
                'db_name' : options['db_name'],
                'site_name' : options['site_name'],
                'score' : score
            } );
        }
    });
}

var updateHybridValues = function( options ) {
    var scores = options[ 'scores' ];
    scores.forEach( function( score ) {
        if ( score['mean'] ) {
            score[ 'mean' ] = score.mean * 0.3 + score.count * 0.7;
            score[ 'variance' ] = Math.sqrt( score.variance * score.variance * 0.3 + score.count * score.count * 0.7 );
            score[ 'hybrid-score' ] = ( score.count - score['mean' ] ) / score.variance + 10000;
            score['count'] = 0;
            hybridModel.upsert( function(){}, {
                "db_name" : options['db_name'],
                "site_name" : options['site_name'],
                "score" : score
            } );
        }
        else {
            score['mean'] = score.count;
            score['variance'] = score.count;
            score['hybrid-score'] = 10000;
            score['count']=0;
            hybridModel.upsert( function(){}, {
                'db_name' : options['db_name'],
                'site_name' : options['site_name'],
                'score' : score
            } );
        }
    });
}

exports.handle = handledata;
exports.set_cron = setCron;
