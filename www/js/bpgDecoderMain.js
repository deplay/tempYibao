var bestimg = angular.module('bestimg', []);
// 用于存放解码后的数据
bestimg.provider('imageDataCache', function() {
    this.$get = ['$cacheFactory', function($cacheFactory) {
        return $cacheFactory('imageData');
    }];
});
// canvas相关服务
bestimg.service('canvas', [function() {
    this.init = function() {
        var cvs = document.createElement('canvas');
        var ctx = cvs.getContext('2d');
        return [cvs, ctx];
    };
    this.supported = function() { // check canvas support
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };
}]);
// webWorker相关服务
bestimg.service('webWorker', [function() {
    this.supported = function() {
        return !!window.Worker;
    };
}]);

// 防抖服务
bestimg.factory('debounce', ['$timeout', function($timeout) {
    function debounce(fn, debounceTime) {
        var timeout;

        function _debounce() {
            console.log('called');
            $timeout.cancel(timeout);
            timeout = $timeout(fn, debounceTime);
        };
        return _debounce;
    }
    return debounce;
}]);
// 属性访问双支点快排
bestimg.factory('DPQ', [function() {
    //属性访问版双支点快排
    var DPQ = (function() {

        var dualPivotQS = {};

        dualPivotQS.sort = function(arr, property, fromIndex, toIndex) {
            if (fromIndex === undefined && toIndex === undefined) {
                this.sort(arr, property, 0, arr.length);
            } else {
                rangeCheck(arr.length, fromIndex, toIndex);
                dualPivotQuicksort(arr, fromIndex, toIndex - 1, 3, property);
            }
            return arr;
        };

        function rangeCheck(length, fromIndex, toIndex) {
            if (fromIndex > toIndex) {
                console.error('fromIndex(' + fromIndex + ') > toIndex(' + toIndex + ')');
            }
            if (fromIndex < 0) {
                console.error(fromIndex);
            }
            if (toIndex > length) {
                console.error(toIndex);
            }
        }

        function swap(arr, i, j) {
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        function dualPivotQuicksort(arr, left, right, div, property) {
            // console.log(right);
            var len = right - left;

            if (len < 27) { // insertion sort for tiny array
                for (var i = left + 1; i <= right; i++) {
                    for (var j = i; j > left && arr[j][property] < arr[j - 1][property]; j--) {
                        swap(arr, j, j - 1);
                    }
                }
                return;
            }
            var third = Math.floor(len / div); //TODO: check if we need to round up or down or just nearest

            // "medians"
            var m1 = left + third;
            // console.log(left);

            // console.log(m1);
            var m2 = right - third;

            if (m1 <= left) {
                m1 = left + 1;
            }
            if (m2 >= right) {
                m2 = right - 1;
            }
            // console.log(m1);
            // console.log(arr[m1]);
            if (arr[m1][property] < arr[m2][property]) {
                swap(arr, m1, left);
                swap(arr, m2, right);
            } else {
                swap(arr, m1, right);
                swap(arr, m2, left);
            }
            // pivots
            var pivot1 = arr[left][property];
            var pivot2 = arr[right][property];

            // pointers
            var less = left + 1;
            var great = right - 1;

            // sorting
            for (var k = less; k <= great; k++) {
                if (arr[k][property] < pivot1) {
                    swap(arr, k, less++);
                } else if (arr[k][property] > pivot2) {
                    while (k < great && arr[great][property] > pivot2) {
                        great--;
                    }
                    swap(arr, k, great--);

                    if (arr[k][property] < pivot1) {
                        swap(arr, k, less++);
                    }
                }
            }
            // swaps
            var dist = great - less;

            if (dist < 13) {
                div++;
            }
            swap(arr, less - 1, left);
            swap(arr, great + 1, right);

            // subarrays
            dualPivotQuicksort(arr, left, less - 2, div, property);
            dualPivotQuicksort(arr, great + 2, right, div, property);

            // equal elements
            if (dist > len - 13 && pivot1 !== pivot2) {
                for (var k = less; k <= great; k++) {
                    if (arr[k][property] === pivot1) {
                        swap(arr, k, less++);
                    } else if (arr[k][property] === pivot2) {
                        swap(arr, k, great--);

                        if (arr[k][property] === pivot1) {
                            swap(arr, k, less++);
                        }
                    }
                }
            }
            // subarray
            if (pivot1 < pivot2) {
                dualPivotQuicksort(arr, less, great, div, property);
            }
        }
        return dualPivotQS;
    }());
    return DPQ;
}]);

// 定义需要相对运动的容器
bestimg.directive('bestimgContainer', function() {
    return {
        restrict: 'A',
        // We have to use controller instead of link here so that it will always run earlier than nested afklLazyImage directives
        controller: ['$element', function($element) {
            $element.data('bpgContainer', $element); //内存银行,注意存储的是wrap过的元素
        }]
    };
});
// 获取容器的宽高横纵
bestimg.service('containerSize', [function() {
    this.height = function(target) {
        var ele = target[0] || target; //优先选择jq-like
        if (!ele) return; //边界处理
        if (ele.tagName === 'ION-CONTENT') ele = ele.childNodes[0]; //ionic的真正容器是ion-content标签中的div.scroll
        return ele.innerHeight || ele.clientHeight || (document.documentElement && document.documentElement.clientHeight) || (document.body && document.body.clientHeight) || window.innerHeight || null;
    };
    this.width = function(target) {
        var ele = target[0] || target; //优先选择jq-like
        if (!ele) return; //边界处理
        if (ele.tagName === 'ION-CONTENT') ele = ele.childNodes[0]; //ionic的真正容器是ion-content标签中的div.scroll
        return ele.innerWidth || ele.clientWidth || (document.documentElement && document.documentElement.clientWidth) || (document.body && document.body.clientWidth) || window.innerWidth || null;
    };
    this.scrollTop = function(target) {
        var ele = target[0] || target; //优先选择jq-like
        if (!ele) return; //边界处理
        if (ele.tagName === 'ION-CONTENT') {
            var divScroll = ele.childNodes[0]; //ionic的真正容器是ion-content标签中的div.scroll
            var transformValue = divScroll.style.transform;
            var transformRegExp = /^translate3d\((-?[\d.]+)px, (-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)$/;
            if (transformRegExp.test(transformValue)) {
                var match = transformValue.match(transformRegExp);
                return -match[2];
            } else {
                return ele.scrollTop || null;
            }
        }
        return ele.pageYOffset || ele.scrollTop || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop) || window.pageYOffset || null;
    };
    this.scrollBottom = function(target) {
        var ele = target[0] || target;
        return this.scrollTop(target) + ele.clientHeight;
    };
    this.scrollLeft = function(target) {
        var ele = target[0] || target; //优先选择jq-like
        if (!ele) return; //边界处理
        if (ele.tagName === 'ION-CONTENT') {
            var divScroll = ele.childNodes[0]; //ionic的真正容器是ion-content标签中的div.scroll
            var transformValue = divScroll.style.transform;
            var transformRegExp = /^translate3d\((-?[\d.]+)px, (-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)$/;
            if (transformRegExp.test(transformValue)) {
                var match = transformValue.match(transformRegExp);
                return -match[1];
            } else {
                return ele.scrollLeft || null;
            }
        }
        return ele.pageXOffset || ele.scrollLeft || (document.documentElement && document.documentElement.scrollLeft) || (document.body && document.body.scrollLeft) || window.pageXOffset || null;
    };
    this.scrollRight = function(target) {
        var ele = target[0] || target;
        return this.scrollLeft(target) + ele.clientWidth;
    };
    this.offsetTop = function(eleWrap, conWrap) {
        var ele = eleWrap[0] || eleWrap;
        var con = conWrap[0] || conWrap;
        var offsetTop = 0;
        while (ele.offsetParent) {
            offsetTop += ele.offsetTop;
            if (ele.offsetParent === con) {
                return offsetTop;
            }
            ele = ele.offsetParent;
        }
        return null;
    };
    this.offsetLeft = function(eleWrap, conWrap) {
        var ele = eleWrap[0] || eleWrap;
        var con = conWrap[0] || conWrap;
        var offsetLeft = 0;
        while (ele.offsetParent) {
            offsetLeft += ele.offsetLeft;
            if (ele.offsetParent === con) {
                return offsetLeft;
            }
            ele = ele.offsetParent;
        }
        return null;
    };
}]);
// 绑定封装
bestimg.factory('eventToggle', ['$window', function($window) {
    function _eventToggle(jqWrap, toggle, fn) {
        if (!jqWrap || !(toggle in { on: true, off: true }) || !angular.isFunction(fn)) return;
        // handle the image is in the view(no need to resize or scroll)
        if (toggle === 'on') angular.element(document).ready(fn);
        // set events for scrolling and resizing on window
        // even if container is not window it is important
        // to cover two cases:
        //  - when container size is bigger than window's size
        //  - when container's side is out of initial window border
        angular.element($window)[toggle]('resize', fn);
        angular.element($window)[toggle]('scroll', fn);
        // if container is not window, set events for container as well
        if (jqWrap[0] !== $window) {
            jqWrap[toggle]('resize', fn);
            jqWrap[toggle]('scroll', fn);
        }
    };
    return _eventToggle;
}]);
// 获取像素密度
bestimg.factory('dPR', ['$window', function($window) {
    function _dPR() {
        return $window.devicePixelRatio || 1;
    }
    return _dPR;
}]);
// 对尺寸进行调整
bestimg.factory('adjustSize', ['dPR', 'bpgConfig', function(dPR, bpgConfig) {
    function _adjustSize(size) {
        return bpgConfig.supportDevicePixelRatio ? +size * dPR() : +size;
    };
    return _adjustSize;
}]);
// 用于在启动时提供配置
bestimg.provider('bpgConfig', [function() {
    // 默认thresh,由于解码需要约半秒，在每图均能节省一半流量的情况下，可以取较大的thresh以获得更好地体验    
    this.thresh = 300;
    // 默认支持对像素密度的处理
    this.supportDevicePixelRatio = true;
    // 标准的宽度，尺寸查找表,前闭后开
    // 针对图片缩小响应范围，ps的放大虽然并不清晰，但依然具有很多无效数据
    // this.defaultMap = [
    //     [320, '320'],
    //     [512, '512'],
    //     [640, '640']
    // ];    
    this.defaultMap = [
        [320, '320'],
        [512, '512'],
        [640, '640'],
        [768, '768'],
        [1024, '1024'],
        [1200, '1200'],
        [1440, '1440']
    ];
    // export
    this.$get = function() {
        return this;
    };
}]);
// 定义主要的标签<bestimg></bestimg>
bestimg.directive('bestimg', ['$q', '$window', '$rootScope', 'canvas', 'webWorker', 'debounce', 'DPQ', 'containerSize', 'eventToggle', 'loadImg', 'bpgConfig', function($q, $window, $rootScope, canvas, webWorker, debounce, DPQ, containerSize, eventToggle, loadImg, bpgConfig) {
    return {
        restrict: 'E',
        compile: function(tElement, tAttrs) {
            var holderImgDeferred = $q.defer();
            var placeHolderImgUrl = '../img/placeholder.png';
            var holderImg = new Image();
            holderImg.src = placeHolderImgUrl;
            holderImg.onload = function() {
                holderImgDeferred.resolve();
            };
            var tplEl = angular.element(holderImg);
            // inherite class and style
            // 指令必须通过class或style显式指定《高度》
            // 否则会引发两个问题
            // 1 获取到的offsetTop由于占位图是1x1,所以高度和宽度相同
            // 2 加载后的图片高度过大的话导致原offset失效
            tplEl.attr('class', tAttrs.class);
            tplEl.attr('style', tAttrs.style);
            // record canvas support
            tAttrs['canvas-supported'] = canvas.supported(); //tAttrs应该跟下方的attrs是同一个对象，提供在此处就不必从element上取，看看源码就解决的问题，你非要折腾，烂泥扶不上墙
            tAttrs['webWorker-supported'] = webWorker.supported();
            // handle other attrs
            // thresh
            tplEl.attr('thresh', tAttrs.thresh);
            // replace
            tElement.replaceWith(tplEl);
            return link;
            // 定义link函数
            function link(scope, element, attrs) {
                holderImgDeferred.promise.then(function() {
                    var watcher; //存放需要监听的dom
                    var thresh = parseInt(attrs.thresh); //letter and undefined will get NaN
                    if (isNaN(thresh)) {
                        thresh = bpgConfig.thresh;
                    }
                    var $container = element.inheritedData('bpgContainer') || angular.element($window);

                    function _responseMain() {
                        var scrollBottom = containerSize.scrollBottom($container);
                        DPQ.sort(watcher, 'offsetTop');
                        loop('off');
                        loop();

                        function loop(mode) {
                            var i = 0,
                                l = watcher.length,
                                counter = 0;
                            for (; i < l; i++) {
                                if (mode === 'off') {
                                    if (watcher[i].visited === true) counter++;
                                } else {
                                    if (watcher[i].visited !== true) {
                                        if (scrollBottom > watcher[i].offsetTop) {
                                            loadImg(watcher[i].element, watcher[i].attrs);
                                            watcher[i].visited = true;
                                        } else {
                                            return;
                                        }
                                    }
                                }
                            }
                            if (counter === l) {
                                eventToggle($container, 'off', _response);
                            }
                        };
                    }
                    var _response = debounce(_responseMain, 300);

                    function _init($container) {
                        // 直接使用外层的变量有可能被污染
                        (watcher = $container.data('dataArr', watcher)) || ($container.data('dataArr', watcher = []));
                        var dataBox = {
                            offsetTop: containerSize.offsetTop(element, $container) - thresh,
                            element: element,
                            attrs: attrs
                        };
                        watcher.push(dataBox);
                    };
                    _init($container);
                    // 下面这句需要$container ready ,注意顺序
                    eventToggle($container, 'on', _response);
                    scope.$on('bestimg.destroyed', _response);
                    // Remove all events when destroy takes place
                    scope.$on('$destroy', function() {
                        // tell our other kids, i got removed
                        $rootScope.$broadcast('bestimg.destroyed');
                        // remove our events and image
                        eventToggle($container, 'off', _response);
                    });
                });
            };
        }
    };
}]);

// 执行图片加载工作
bestimg.factory('loadImg', ['$q', '$timeout', 'canvas', 'imageDataCache', 'bpgConfig', 'adjustSize', function($q, $timeout, canvas, imageDataCache, bpgConfig, adjustSize) {
    // 执行替换动作
    function _loadImg(element, attrs) {
        if (!attrs['imgSrc']) {
            console.log('need img-src');
            return;
        };
        if (!attrs['imgSfx']) {
            console.log('need img-sfx');
            return;
        }
        var adjustedWidth = adjustSize(element[0].width);
        var map;
        if (attrs.map) {
            map = JSON.parse(attrs.map.replace(/\'/g, '"'));
        } else {
            map = bpgConfig.defaultMap;
        }
        if (attrs['canvas-supported'] && attrs['webWorker-supported']) { //如果进行取反操作是为了调试fallback
            // 创建canvas元素
            var canvasNew = canvas.init();
            var newCanvas = canvasNew[0];
            var newContext = canvasNew[1];
            // 继承class和style
            var newCanvasWrapper = angular.element(newCanvas);
            newCanvasWrapper.attr('class', attrs.class);
            newCanvasWrapper.attr('style', attrs.style);
            // 根据canvas尺寸请求合适的图片
            $timeout(function() {
                var fullPath,
                    skipFlag = false;
                angular.forEach(map, function(v) {
                    if (skipFlag === true) return;
                    if (adjustedWidth < v[0]) {
                        fullPath = '../' + attrs['imgSrc'] + '@' + v[1] + attrs['imgSfx'] + '.bpg';
                        skipFlag = true;
                    }
                });
                if (!fullPath) {
                    var v = map[map.length - 1];
                    fullPath = '../' + attrs['imgSrc'] + '@' + v[1] + attrs['imgSfx'] + '.bpg';
                };
                // 根据canvas尺寸完成图片渲染
                function render(data) {
                    var f = data.frames;
                    var g = f[0].img;
                    var n,
                        q,
                        loopCount = 0;
                    newCanvas.width = g.width;
                    newCanvas.height = g.height;
                    newContext.putImageData(g, 0, 0); //播放第一帧
                    1 < f.length && (n = 0, q = 0, setTimeout(d, f[0].duration)); //播放动画
                    function d() {
                        if (newCanvas.offsetHeight === 0) {
                            setTimeout(d, 500);
                            return;
                        }
                        var a = n;
                        ++a >= f.length && (0 === loopCount || q < loopCount ? (a = 0, q++) : a = -1);
                        0 <= a && (n = a, newContext.putImageData(f[a].img, 0, 0), setTimeout(d, f[a].duration));
                    }
                    // 成功解码数据替换节点
                    element.replaceWith(newCanvas);
                };
                var cachedImageDataPromise = imageDataCache.get(fullPath);
                if (cachedImageDataPromise) {
                    cachedImageDataPromise.then(function(cachedImageData) {
                        render(cachedImageData);
                    }, function() {
                        console.log('获取promise失败');
                    });
                } else {
                    var deferred = $q.defer();
                    imageDataCache.put(fullPath, deferred.promise);
                    var decodeWorker = new Worker('./js/bpgDecoderWorker.min.js');
                    decodeWorker.onmessage = function(e) {
                        if (e.data.width && e.data.height && !(e.data.frames && e.data.frames.length)) {
                            var wrapper = function() {
                                var canvasNew = canvas.init();
                                var ctx = canvasNew[1];
                                var imageData = ctx.createImageData(e.data.width, e.data.height);
                                return imageData;
                            };
                            decodeWorker.postMessage(wrapper());
                        } else if (e.data.frames && e.data.frames.length) {
                            var f = e.data.frames;
                            var canvasNew = canvas.init();
                            var ctx = canvasNew[1];
                            for (var i = 0, l = f.length; i < l; i++) {
                                var imageData = ctx.createImageData(e.data.width, e.data.height);
                                imageData.data.set(f[i].img);
                                f[i].img = imageData;
                            }
                            // pass the data
                            deferred.resolve(e.data);
                            render(e.data);
                        }
                    };
                    decodeWorker.postMessage({ url: fullPath });
                }
            });
        } else { //不支持canvas
            var newImage = new Image();
            // 继承class和style
            var newImageWrapper = angular.element(newImage);
            newImageWrapper.attr('class', attrs.class);
            newImageWrapper.attr('style', attrs.style);
            // 根据image尺寸请求合适的图片
            $timeout(function() {
                // console.log(map);
                var fullPath,
                    skipFlag = false;
                angular.forEach(map, function(v) {
                    if (skipFlag === true) return;
                    if (adjustedWidth < v[0]) {
                        fullPath = attrs['imgSrc'] + '@' + v[1] + attrs['imgSfx'];
                        newImage.src = fullPath;
                        skipFlag = true;
                    }
                });
                if (!fullPath) {
                    var v = map[map.length - 1];
                    fullPath = attrs['imgSrc'] + '@' + v[1] + attrs['imgSfx'];
                    newImage.src = fullPath;
                };
                // 加载成功替换节点
                newImage.onload = function() {
                    element.replaceWith(newImage);
                };
            });
        }
    };
    return _loadImg;
}]);
