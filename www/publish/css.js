var child_process = require('child_process');
var exec = child_process.exec;
var iconv = require('iconv-lite');
var walk = require('walk');
var fs = require('fs');
var sass = require('node-sass');
var less = require('less');

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

// ionic
var ionicPath = path + '\\dependencies\\css\\ionic';
var walker = walk.walk(ionicPath, { followLinks: false });
var scssRegExp=/\.scss$/im;
walker.on('file', function(root, stat, next) {
    if ((stat.name.indexOf('.min') > -1) || (!scssRegExp.test(stat.name))) {
        next();
        return;
    }
    var full = root + '\\' + stat.name;
    var tmpArr = full.split('.');
    var suffix = tmpArr[tmpArr.length - 1];
    tmpArr.splice(-1, 1, 'min', 'css');
    var outputName = tmpArr.join('.');
    var mapName = outputName + '.map';
    var result = sass.renderSync({
        file: full,
        outputStyle: 'compressed',
        outFile: outputName,
        sourceMap: false // or an absolute or relative (to outFile) path
    });
    if (result.css) fs.writeFileSync(outputName, result.css);
    // fs.writeFileSync(mapName, result.map);
    next();
});
// bootstrap
var bootstrapPath = path + '\\dependencies\\css\\bootstrap';
var walker = walk.walk(bootstrapPath, { followLinks: false });
var lessRegExp=/\.less$/im;
walker.on('file', function(root, stat, next) {
    if ((stat.name.indexOf('.min') > -1) || (!lessRegExp.test(stat.name))) {
        next();
        return;
    }
    var full = root + '\\' + stat.name;
    var tmpArr = full.split('.');
    var suffix = tmpArr[tmpArr.length - 1];
    tmpArr.splice(-1, 1, 'min', 'css');
    var outputName = tmpArr.join('.');
    var mapName = outputName + '.map';
    var css = fs.readFileSync(full).toString();
    // console.log(css);
    less.render(css, {
        filename: full, // Specify a filename, for better error messages
        compress: true // Minify CSS output
    }, function(error, output) {
        if (error) {
            console.log(error);
            return;
        }
        // console.log(output);
        if (output.css) fs.writeFileSync(outputName, output.css);
        // fs.writeFileSync(mapName, output.map);
    });
    next();
});
// css
var cssPath = path + '\\dependencies\\css';
var walker = walk.walk(cssPath, { followLinks: false });
var cssRegExp=/\.css$/im;
walker.on('file', function(root, stat, next) {
    if ((stat.name.indexOf('.min') > -1) || (!cssRegExp.test(stat.name))) {
        next();
        return;
    }
    var full = root + '\\' + stat.name;
    // console.log(full);
    var tmpArr = full.split('.');
    var suffix = tmpArr[tmpArr.length - 1];
    tmpArr.splice(-1, 1, 'min', 'css');
    var outputName = tmpArr.join('.');
    var mapName = outputName + '.map';
    var css = fs.readFileSync(full).toString();
    // console.log(css);
    less.render(css, {
        paths: [bootstrapPath, bootstrapPath + '\\mixins'], // Specify search paths for @import directives
        filename: full, // Specify a filename, for better error messages
        compress: true // Minify CSS output
    }, function(error, output) {
        if (error) {
            console.log(error);
            return;
        }
        if (output.css) fs.writeFileSync(outputName, output.css);
        // fs.writeFileSync(mapName, output.map);
    });
    next();
});
















// var walker = walk.walk(path + '/2bpg/', { followLinks: false });
// walker.on('directory', function(root, stat, next) {
//     if (stat.name.search('anim') > -1) {
//         var outputName = path + '\\2bpg\\' + stat.name + '\\' + stat.name + '.bpg';
//         var prefix = 'frame';
//         var fps = '20';
//         var suffix = '.jpg';
//         var inputName = ' -a ' + path + '\\2bpg\\' + stat.name + '\\' + prefix + '_%4d' + suffix + ' -fps ' + fps;
//         var command = path + '\\encoder\\bpgenc.exe -o ' + outputName + inputName;
//         shell(command);
//     } else {
//         var imgDir = path + '\\2bpg\\' + stat.name + '\\';
//         var walker = walk.walk(imgDir, { followLinks: false });
//         walker.on('file', function(root, stat, next) {
//             if (stat.name.search('\.bpg')>-1) return;
//             var inputName = root + stat.name;
//             var outputName = inputName + '.bpg';
//             var command = path + '\\encoder\\bpgenc.exe -o ' + outputName + ' ' + inputName;
//             shell(command);
//             next();
//         });
//     }
//     next();
// });
