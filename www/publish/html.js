var child_process = require('child_process');
var exec = child_process.exec;
var iconv = require('iconv-lite');
var walk = require('walk');
var fs = require('fs');
var minify = require('html-minifier').minify;

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

var htmlPath = path + '\\dependencies\\html';
var walker = walk.walk(htmlPath, { followLinks: false });
walker.on('file', function(root, stat, next) {
    if ((stat.name.indexOf('.min') > -1) || (stat.name.indexOf('.html') === -1)) {
        next();
        return;
    }
    var full = root + '\\' + stat.name;
    var cutter = path + '\\';
    var minNm = minName(full);
    var key = relativePath(minNm, cutter); //取到相对路径作key
    // 包装成可用ng-template标签
    var originalHtmlBuffer = fs.readFileSync(full);
    var header = '<script type="text/ng-template" id="' + key + '">';
    var headerBuffer = new Buffer(header, encoding = 'utf8');
    var footer = '</script>';
    var footerBuffer = new Buffer(footer, encoding = 'utf8');
    var all = Buffer.concat([headerBuffer, originalHtmlBuffer, footerBuffer]);
    var COMMENT_PSEUDO_COMMENT_OR_LT_BANG = new RegExp(
        '<!--[\\s\\S]*?(?:-->)?' + '<!---+>?' // A comment with no body
        + '|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?' + '|<[?][^>]*>?', // A pseudo-comment
        'mg');
    var noWhiteSpaces = all.toString()
        .replace(/[\r\n]/g, '')
        .replace(/[\t ]+\</g, '<')
        .replace(/\>[\t ]+\</g, '><')
        .replace(/\>[\t ]+$/g, '>')
        .replace(COMMENT_PSEUDO_COMMENT_OR_LT_BANG, '');
    fs.writeFileSync(minNm, noWhiteSpaces);
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
