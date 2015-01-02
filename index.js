var server = require("./server");
var router = require("./router");
console.log('loaded router');

var handle = {};
handle["staticdata"] = './applications/staticdata/router';
handle["datasource"] = './applications/dynamicDatasource/router';
handle["dynamicdata"] = './applications/dynamicdata/router';
handle['final'] = './applications/final/router';

GLOBAL.performanceRam = {
    'rss' : 0,
    'heapTotal' : 0,
    'heapUsed' : 0
};
GLOBAL.performanceRamTotal = 0;

server.start(router.route,handle);

