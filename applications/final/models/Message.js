var conn = require('../../../connection');
var mongodb = require('mongodb');

var storeData = function(callback,options){
    conn.getConnection(options['db_name'],function(client){
        var collection = mongodb.Collection(client,options['site_name']+'_messages' );
        collection.insert(options['messages'],function(){
            callback(options);
        });
    });
}

var fetchMessages = function( callback, options ) {
    conn.getConnection( options['db_name'], function( client ) {
        var collection = mongodb.Collection( client, options['site_name'] + '_messages' );
        var iter = collection.find( { "hashtags" : options['tag'] } ).limit( 10 );
        iter.toArray(function( err, data ) {
            if ( err )
                console.log( err );
            else {
                options['messages'] = data;
                callback( options );
            }
        } );
    });
}

exports.store = storeData;
exports.fetchMessages = fetchMessages;
