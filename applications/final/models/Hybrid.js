var conn = require( '../../../connection' );
var mongodb = require( 'mongodb' );

var upsert = function( callback, options ) {
    conn.getConnection( options['db_name'], function( client ) {
        var score = options['score'];
        var collection = mongodb.Collection( client, options['site_name'] + '_hybrid' );
        collection.update( { 'text' : score.text }, { '$set' : score }, { 'upsert' : true }, function( err, numOfRows ) {
            if ( err ) {
                console.log( err );
            }
        } );
    } );
}

var fetchAll = function( callback, options ) {
    conn.getConnection( options['db_name'], function( client ) {
        var collection = mongodb.Collection( client, options['site_name'] + '_hybrid' );
        var iter = collection.find();
        iter.toArray( function( err, data ) {
            if ( err ) {
                console.log( err );
            }
            else {
                options['scores'] = data;
                callback( options );
            }
        } );
    } );
}

var fetchTrends = function( callback, options ) {
    conn.getConnection( options['db_name'], function( client ) {
        collection = mongodb.Collection( client, options['site_name'] + '_hybrid' );
        var iter = collection.find().sort( { 'iir-score' : -1 } ).limit( 10 );
        iter.toArray( function( err, data ) {
            if ( err )
                console.log( err );
            else {
                options['tags'] = data;
                callback( options );
            }
        } );
    } );
}

var storeData = function( callback, options ) {
    conn.getConnection( options['db_name'], function( client ) {
        var collection = mongodb.Collection( client, options['site_name'] + '_hybrid' );
        var tags = options['tags'];
        tags.forEach( function( tag ) {
            collection.update( tag, { '$inc' : { 'count' : 1 } }, { 'upsert' : true }, function( err, numOfRows ) {
                if ( err )
                    console.log( err );
            } );
        } );
        callback( options );
    } );
}

exports.upsert = upsert;
exports.fetchAll = fetchAll;
exports.fetchTrends = fetchTrends;
exports.store = storeData;
