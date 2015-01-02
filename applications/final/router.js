var handle = require('./index.js').handle;

function route (segments,response,postData)
{
    console.log('successfully entered final application ');
    var currentMemoryUsage = process.memoryUsage();
    GLOBAL.performanceRam.rss = ( GLOBAL.performanceRam.rss * GLOBAL.performanceRamTotal + currentMemoryUsage.rss ) / ( GLOBAL.performanceRamTotal + 1 );
    GLOBAL.performanceRam.heapTotal = ( GLOBAL.performanceRam.heapTotal * GLOBAL.performanceRamTotal + currentMemoryUsage.heapTotal ) / ( GLOBAL.performanceRamTotal + 1 );
    GLOBAL.performanceRam.heapUsed = ( GLOBAL.performanceRam.heapUsed * GLOBAL.performanceRamTotal + currentMemoryUsage.heapUsed ) / ( ++GLOBAL.performanceRamTotal );
    try {
	if (segments[2]==undefined) {
	    var controller = require(handle['defaultController']);
	    controller.index(segments,response,postData);
	}
	else {
	    var controller = require(handle[segments[2]]);
	    controller[segments[3]](segments,response,postData);
	}
    } catch(err) {
	console.log("error occured: "+ err);
	response.writeHead(404, {"Content-Type" : "text/plain"});
	response.write("404 not found");
	response.end();
    }
}

exports.route = route;
