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

exports.store = storeData; 
