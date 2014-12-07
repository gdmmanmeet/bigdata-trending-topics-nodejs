var querystring = require('querystring');
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

exports.handle = handledata;
