var querystring = require('querystring');
var cron = require( 'cron' );
var zModel = require( '../models/Z.js' );
var tagModel = require('../models/Tag.js');
var messagesModel = require('../models/Message.js');

var handledata = function( segments, response, postData ){
   if (postData){
       response.writeHead(200, { "content-type" : "text/html" } );
       var parsedData = querystring.parse(postData);
       var messages = JSON.parse(parsedData['messages']);
       var options = {
           'db_name' : parsedData['db_name'],
           'site_name' : parsedData['site_name'],
           'messages' : messages
       };
       var tags = [];
       messages.forEach(function(tweet){
           tweet.hashtags.forEach(function(hashtag){
               tags.push( { "text":hashtag } );
           });
       });
       options['tags'] = tags;
       zModel.store(storeMessages,options);
       response.end();
   }
   else{
      response.writeHead( 404, { "content-type" : "text/html" } );
      response.write(" 404 not found");
      response.end();
   }
}

var storeMessages = function( options ){
    messagesModel.store(function(){},options);
}

var setCron = function( segments, response, postData ) {
    if ( postData ) {
        response.writeHead( 200, { "Content-Type" : "text/html" } );
        var parsedData = querystring.parse( postData );
        console.log( parsedData['score_rate']);
        if ( !GLOBAL.dataControllerCron )
            GLOBAL.dataControllerCron = new cron.CronJob (parsedData[ 'score_rate' ] + ' * * * * *', function() {
                console.log('\n\n\n\n ******** cron started *********\n\n\n\n');
                zModel.fetchAll( updateZValues, parsedData );
            }, null, true );
        else
        {

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
            score[ 'z-score' ] = ( score.count - score['mean' ] ) / score.variance;
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
            score['z-score'] = 0;
            score['count']=0;
            zModel.upsert( function(){}, {
                'db_name' : options['db_name'],
                'site_name' : options['site_name'],
                'score' : score
            } );
        }
    });
}

exports.handle = handledata;
exports.set_cron = setCron;
