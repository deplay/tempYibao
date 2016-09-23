// 发布程序

// 基础数据和功能
var child_process = require('child_process');
var exec = child_process.exec;
var iconv = require('iconv-lite');
var walk = require('walk');
var fs = require('fs');
var compressor = require('yuicompressor');
var less = require('less');

var fileNameArr = __filename.split('\\');
var compilerPath = fileNameArr.slice(0, -1).join('\\');
var devPath = compilerPath + '\\develop';
var pdtPath = compilerPath + '\\product';

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

function fileType(fileName) {
    return fileName.split('.').pop();
}

function minName(originalName) {

    return originalName;
    var tmpArr = originalName.split('\\');
    if (tmpArr[tmpArr.length - 1].indexOf('.min.') !== -1) {
        return originalName;
    }
    var tmpArr2 = originalName.split('.');
    tmpArr2.splice(-1, 0, 'min');
    return tmpArr2.join('.');
};



//创建多层文件夹 同步 自动补全
function mkdirsSync(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        var pathArr = dirpath.split('\\');
        // console.log(pathArr);
        var basicPath = pathArr[0];
        pathArr.forEach(function(v, k, o) {
            if (k === 0) return;
            basicPath += '\\' + v;
            // console.log(basicPath);
            if (!fs.existsSync(basicPath)) {
                if (!fs.mkdirSync(basicPath, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
};
// 处理其他文件
function otherFiles(dFP, pFP) {
    var cmdPrefix = 'copy /y ';
    cmdPrefix += dFP + ' ';
    cmdPrefix += pFP;
    shell(cmdPrefix);
};
// html 处理函数
function htmlHandle(dFP, pFP) {
    var htmlRelativePath = dFP.replace(compilerPath + '\\develop', '');
    var skipMap = { '\\index.html': true }
    // console.log(htmlRelativePath);
    if (skipMap[htmlRelativePath]) {
        var header = '';
        var footer = '';
    } else {
        pFP = minName(pFP);
        var tmpName = minName(htmlRelativePath);
        var header = '';
        var footer = '';
        // var header ='<script type="text/ng-template" id="' + tmpName + '">'; 
        // var footer ='</script>';
    }

    // console.log(tmpName);
    // 构造成templateCache使得在整个应用内可用
    var originalHtmlBuffer = fs.readFileSync(dFP);
    var headerBuffer = new Buffer(header, encoding = 'utf8');
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
    // console.log(noWhiteSpaces);
    fs.writeFileSync(pFP, noWhiteSpaces);
}

// js 处理函数
function jsHandle(dFP, pFP) {
    if (dFP.indexOf('.min.js')!==-1){
        otherFiles(dFP, pFP);
        return
    }
    var originalJsBuffer = fs.readFileSync(dFP);
    compressor.compress(originalJsBuffer.toString(), {
        charset: 'utf8',
        type: 'js',
        nomunge: true,
        'line-break': 80
    }, function(err, data, extra) {
        if (err) console.log(err);
        fs.writeFileSync(minName(pFP), data);
        //err   If compressor encounters an error, it's stderr will be here
        //data  The compressed string, you write it out where you want it
        //extra The stderr (warnings are printed here in case you want to echo them
    });
}

// css 处理函数
function cssHandle(dFP, pFP) {
    if (dFP.indexOf('.min.css')!==-1){
        otherFiles(dFP, pFP);
        return
    }
    var originalCssBuffer = fs.readFileSync(dFP);
    less.render(originalCssBuffer.toString(), {
        filename: dFP, // Specify a filename, for better error messages
        compress: true // Minify CSS output
    }, function(error, output) {
        if (error) {
            console.log(error);
            return;
        }
        // console.log(output.css);
        if (output.css) fs.writeFileSync(minName(pFP), output.css);
    });
}


// 开始处理
var walker = walk.walk(devPath, { followLinks: false });
walker.on('file', function(root, stat, next) {
    var tempPdtPath = root.replace('www\\yibao\\develop', 'www\\yibao\\product')
    var devFilePath = root + '\\' + stat.name;
    var pdtFilePath = tempPdtPath + '\\' + stat.name;
    // console.log(devFilePath);
    // console.log(pdtFilePath);
    if (mkdirsSync(tempPdtPath)) {
        var handleMap = {
            html: htmlHandle,
            js: jsHandle,
            css:cssHandle
        };
        // 处理
        (handleMap[fileType(stat.name)] || otherFiles)(devFilePath, pdtFilePath);
        // 下一个
        next();
    } else {
        throw '建立对应文件夹失败';
    }

});
