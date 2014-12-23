var conn = require( '../../../connection' );
var mongodb = require( 'mongodb' );

var upsert = function( callback, options ) {
    conn.getConnection( options['db_name'], function( client ) {
        var score = options['score'];
       var collection = mongodb.Collection( client, options['site_name'] + '_z' );
      collection.update( { 'text' : score.text }, { '$set' : score }, { "upsert" : true }, function( err, numOfRows ) {
          if ( err ) {
              console.log( "error occurred :" + err );
          }
      });
    });
}

var fetchAll = function( callback, options ) {
    conn.getConnection( options['db_name'], function( client ) {
        var collection = mongodb.Collection( client, options['site_name'] + '_z' );
        var iter = collection.find();
        iter.toArray( function( err, data ) {
            if ( err ) {
                console.log( '\n\n\n\nerror occured' + err );
            }
            else {
                options['scores'] = data;
                callback(options);
            }
        });
    });
}

exports.upsert = upsert;
exports.fetchAll = fetchAll;
