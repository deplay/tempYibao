var child_process = require('child_process');
var exec = child_process.exec;
var iconv = require('iconv-lite');
var walk = require('walk');
var fs = require('fs');
// var UglifyJS = require("uglify-js");
var compressor = require('yuicompressor');

var fileNameArr = __filename.split('\\');
var path = fileNameArr.slice(0, -2).join('\\');

function shell(command) {
    // cp936 for windows shell utf8 for sublime
    var encoding = 'cp936';
    // var encoding = 'utf8';
    var binaryEncoding = 'binary';
    var config = { encoding: binaryEncoding };
    var callback = function(err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        console.log(iconv.decode(new Buffer(stdout, binaryEncoding), encoding), iconv.decode(new Buffer(stderr, binaryEncoding), encoding));
    }
    exec(command, config, callback);
};

function relativePath(full, cutter) {
    return full.split(cutter).pop().replace(/\\/g, '/');
};

function minName(originalName) {
    var tmpArr = originalName.split('.');
    tmpArr.splice(-1, 0, 'min');
    return tmpArr.join('.');
};

var jsPath = path + '\\js';
console.log(jsPath);
var walker = walk.walk(jsPath, { followLinks: false });
walker.on('file', function(root, stat, next) {
    if ((stat.name.indexOf('.min') > -1) || (stat.name.indexOf('.js') === -1)) {
        next();
        return;
    }
    var full = root + '\\' + stat.name;
    var mapName = full + '.map';
    var originalJsBuffer = fs.readFileSync(full);
    // var result = UglifyJS.minify(originalJsBuffer.toString(), { fromString: true });
    compressor.compress(originalJsBuffer.toString(), {
        //Compressor Options:
        charset: 'utf8',
        type: 'js',
        nomunge: true,
        'line-break': 80
    }, function(err, data, extra) {
    	console.log(full);
    	console.log(err);
        // console.log(data);
        var minNm = minName(full);
        var minNmMap = minNm + '.map';
        fs.writeFileSync(minNm, data);
        next();
        //err   If compressor encounters an error, it's stderr will be here
        //data  The compressed string, you write it out where you want it
        //extra The stderr (warnings are printed here in case you want to echo them
    });



});
