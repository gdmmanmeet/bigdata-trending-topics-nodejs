var conn = require('../../../connection');
var mongodb = require('mongodb');

var fetch = function(callback, options){
    conn.getConnection('frouzan',function(client){
        var collection = mongodb.Collection(client,'chapter1');
        var messages = collection.find().limit(parseInt(options['data_rate'])).skip( options[ 'offset' ] );
        var data = [];
        messages.each(function(err,doc) {
            if (err){
                console.log(err);
            }
            else if (doc){
                data.push(doc);
            }
            else {
                options['data'] = data;
                process.nextTick( function(){
                    callback(options);
                });
            }
        });
    });
}

exports.fetch = fetch;
