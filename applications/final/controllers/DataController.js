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
       tagModel.store(storeMessages,options);
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
        tagModel.fetchAndRemove( function( options ) {
            tags = options['tags'];
            tags.forEach( function( tag ) {
                score[ 'mean' ] = ( score.total * score.mean + tag.count )/( score.total + 1 );
                score[ 'variance' ] = Math.sqrt( ( score.total * score.variance * score.variance + tag.count * tag.count ) / ( score.total + 1 ) );
                score[ 'total' ]++;
                score[ 'z-score' ] = ( tag.count - score['mean' ] ) / score.variance;
                zModel.upsert( function(){}, {
                    "db_name" : options['db_name'],
                    "site_name" : options['site_name'],
                    "score" : score
                } );
            });
        },{
            "db_name" : options['db_name'],
            "site_name" : options['site_name'],
            "score" : score,
            "condition" : { "text" : score['text'] }
        });
    });
    tagModel.fetchAll( function( options ){
        var tags = options['tags'];
        tags.forEach( function( tag ) {
            zModel.upsert( function(){}, {
                "db_name" : options['db_name'],
                "site_name" : options['site_name'],
                "score" : {
                    "text":tag.text,
                    "mean":tag.count,
                    "variance":tag.count,
                    "total":1,
                    "z-score":0
                }
            });
        });
        tagModel.drop( function(){}, {
            "db_name" : options['db_name'],
            "site_name" : options['site_name']
        });
    },{
        "db_name" : options['db_name'],
        "site_name" : options['site_name']
    });
}

exports.handle = handledata;
exports.set_cron = setCron;
