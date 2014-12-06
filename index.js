var server = require("./server");
var router = require("./router");
console.log('loaded router');

var handle = {};
handle["staticdata"] = './applications/staticdata/router';
handle["datasource"] = './applications/dynamicDatasource/router';
handle["dynamicdata"] = './applications/dynamicdata/router';
handle['final'] = './applications/final/router';

server.start(router.route,handle);

