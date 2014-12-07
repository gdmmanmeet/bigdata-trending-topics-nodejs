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

exports.store = storeData;
