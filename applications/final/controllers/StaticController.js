var fs = require( 'fs' );
var path = require( 'path' );
var staticDirectory = require( '../index' ).staticDirectory;

var index = function ( segments, response, postData ){
    var filePath = staticDirectory + segments.slice(4).join('/');
    var data = fs.readFileSync( filePath, 'utf8' );
    switch(path.extname(filePath)){
        case '.css':
            response.writeHead( 200, { "content-type" : "text/css" } );
            break;
        case '.js':
            response.writeHead( 200, { "content-type" : "text/javascript" } );
            break;
        default:
            response.writeHead( 200, { "content-type" : "text" } );
    }
    response.write(data);
    response.end();
}

exports.file = index;
