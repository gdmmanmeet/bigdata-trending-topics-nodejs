var conn = require('../../../connection');
var mongodb = require('mongodb');

var storeData = function(callback,options){
    conn.getConnection(options['db_name'],function(client){
        var collection = mongodb.Collection(client,options['site_name']+'_tags');
        var tags = options['tags'];
        tags.forEach(function(tag){
            collection.update( tag, { '$inc' :{ 'count' : 1 } },{ 'upsert' : true }, function(err, perr) {
                if (err){
                    console.log("mongodb error occurred : " + err );
                }
            });
        });
        process.nextTick( function() {
            callback(options);
        });
    });
}

var fetchAll = function( callback, options ) {
    conn.getConnection( options[ 'db_name' ], function( client ) {
        var collection = mongodb.Collection( client, options['site_name'] + '_tags' );
        iter = collection.find({});
        iter.toArray( function( err, data ){
            if (err){
                console.log( err );
            }
            else {
                options['tags'] = data;
                callback( options );
            }
        } );
    } );
}

var fetchAndRemove = function( callback, options ) {
    conn.getConnection( options['db_name'], function( client ) {
        var collection = mongodb.Collection( client, options['site_name'] + '_tags' );
        var iter = collection.find( options[ 'condition' ] );
        if (iter)
            iter.toArray( function( err, data ) {
                if ( err ) {
                    console.log( err );
                }
                else {
                    collection.remove( options['condition'],function(){} );
                    if (data.length)
                        options['tags'] = data;
                    else
                        options['tags'] = [{'text':options['condition']['text'],'count':0}];
                    callback( options );
                }
            });
        else
        {
            options['tags'] = [];
            callback( options );
        }
    });
}

var drop = function( callback, options ) {
    conn.getConnection( options['db_name'], function( client ){
        var collection = mongodb.Collection( client, options['site_name'] + '_tags' );
        collection.drop();
    });
}

exports.store = storeData; 
exports.fetchAll = fetchAll;
exports.fetchAndRemove = fetchAndRemove;
exports.drop = drop;
