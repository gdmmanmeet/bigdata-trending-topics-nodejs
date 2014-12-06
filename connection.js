var mongodb = require('mongodb');
var access = new mongodb.Server('localhost',27017,{});
var client = [];

var getConnection = function(dbName,callback){
    if (client[dbName])
        callback(client[dbName]);
    else {
        new mongodb.Db(dbName,access,{safe:true,auto_reconnect:true}).open(function(err,c){
            if (err) {
                console.log( 'database connection error ',err);
            }
            else {
                console.log('database '+ dbName + ' connected');
                client[dbName] = c;
                callback(client[dbName]);
            }
        });
    }
}

exports.getConnection = getConnection;
