var bigDataStore = require('../models/BigDataStore');
var util = require('./util');
var querystring = require('querystring');
var http = require('http');

var throwData = function ( segments, response, postData ){
    response.writeHead( 200, { "content-type" : "text/html" } );
    if ( postData ) {
	    var parsedData  = querystring.parse(postData);
        var req = http.request({
            "host" : "saheb",
            "hostname" : "saheb",
            "port" : "8888",
            "method" : "POST",
            "path" : "/final/sink/set_cron"
        });
        req.on( 'error', function( e ){
            console.log( e );
        });
        req.write( postData );
        req.end();
        if (!GLOBAL.datasourceInterval) {
            GLOBAL.datasourceInterval = util.setInterval(function(datarate){
	            bigDataStore.fetch( throwMessages,{
	                'data_rate':datarate,
	                'db_name' : decodeURIComponent(parsedData['db_name']),
	                'site_name' : decodeURIComponent(parsedData['site_name']),
                    'approach' : decodeURIComponent( parsedData['approach'] )
                });
            },parsedData['data_rate']);
            GLOBAL.performanceMessageFetchTime = 0;
            GLOBAL.performanceMessageFetchTotal = 0;
            GLOBAL.performanceTagFetchTime = 0;
            GLOBAL.performanceTagFetchTotal = 0;
        }
        else
            GLOBAL.datasourceInterval.changeDataRate(parsedData['data_rate']);
    }
    else {
        response.write("error");
    }
    response.end();
}

var throwMessages = function(options){
    var data = options['data'];
    var req = http.request({
	    "host":"saheb",
	    "hostname":"saheb",
	    "port":"8888",
	    "method":"POST",
	    "path":"/final/sink/handle"
    });
    req.on('error',function(e){
	console.log('problem with request'+e.message);
    });
    console.log(data.length);
    req.write('messages='+JSON.stringify(data)+'&db_name='+options['db_name']+'&site_name='+options['site_name'] + '&approach=' + options['approach'] );
    req.end();
    console.log("data store successfully started");
}

exports.start = throwData;
