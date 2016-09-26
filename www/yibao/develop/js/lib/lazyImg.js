var lazyImg = angular.module('lazyImg', []);
// 防抖服务
lazyImg.factory('debounce', ['$timeout', function($timeout) {
    function debounce(fn, debounceTime) {
        var timeout;

        function _debounce() {
            $timeout.cancel(timeout);
            timeout = $timeout(fn, debounceTime);
        };
        return _debounce;
    }
    return debounce;
}]);

// 属性访问双支点快排
lazyImg.factory('DPQ', [function() {
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
lazyImg.directive('lazyImgContainer', function() {
    return {
        restrict: 'A',
        // We have to use controller instead of link here so that it will always run earlier than nested afklLazyImage directives
        controller: ['$element', function($element) {
            $element.data('lazyImgContainer', $element); //内存银行,注意存储的是wrap过的元素
        }]
    };
});
// 获取容器的宽高横纵
lazyImg.service('containerSize', [function() {
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
lazyImg.factory('eventToggle', ['$window', function($window) {
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
lazyImg.factory('dPR', ['$window', function($window) {
    function _dPR() {
        return $window.devicePixelRatio || 1;
    }
    return _dPR;
}]);

// 用于在启动时提供配置
lazyImg.provider('lazyImgConfig', [function() {
    // 默认thresh
    this.thresh = 250;//250
    // 默认支持对像素密度的处理
    this.supportDevicePixelRatio = true;
    // export
    this.$get = function() {
        return this;
    };
}]);
// 定义主要的标签<lazyImg></lazyImg>
lazyImg.directive('lazyImg', ['$q', '$window', '$rootScope', 'debounce', 'DPQ', 'containerSize', 'eventToggle', 'loadImg', 'lazyImgConfig', function($q, $window, $rootScope, debounce, DPQ, containerSize, eventToggle, loadImg, lazyImgConfig) {
    return {
        restrict: 'E',
        compile: function(tElement, tAttrs) {
            return link;
            // 定义link函数
            function link(scope, element, attrs) {
                var watcher; //存放需要监听的dom
                var thresh = parseInt(attrs.thresh); //letter and undefined will get NaN
                if (isNaN(thresh)) {
                    thresh = lazyImgConfig.thresh;
                }
                var $container = element.inheritedData('lazyImgContainer') || angular.element($window);

                function _responseMain() {
                    var scrollBottom = containerSize.scrollBottom($container);

                    // 下面三句顺序不可变
                    loop('off');
                    DPQ.sort(watcher, 'offsetTop');
                    loop();

                    function loop(mode) {
                        var i = 0,
                            l = watcher.length,
                            counter = 0;
                        for (; i < l; i++) {
                            if (mode === 'off') {
                                if (watcher[i].visited === true) counter++;
                            } else {
                                if (scrollBottom < watcher[i].offsetTop) {
                                    return;
                                } else {
                                    if (watcher[i].visited !== true) {
                                        loadImg(watcher[i].element, watcher[i].attrs);
                                        watcher[i].visited = true;
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
                        get offsetTop() {
                            return containerSize.offsetTop(element, $container) - thresh },
                        element: element,
                        attrs: attrs
                    };
                    watcher.push(dataBox);
                };
                _init($container);
                // 下面这句需要$container ready ,注意顺序
                eventToggle($container, 'on', _response);
                scope.$on('lazyImg.destroyed', _response);
                // Remove all events when destroy takes place
                scope.$on('$destroy', function() {
                    // tell our other kids, i got removed
                    $rootScope.$broadcast('lazyImg.destroyed');
                    // remove our events and image
                    eventToggle($container, 'off', _response);
                });
            };
        }
    };
}]);

// 执行图片加载工作
lazyImg.factory('loadImg', ['$q', '$timeout', 'lazyImgConfig', function($q, $timeout, lazyImgConfig) {
    // 执行替换动作
    function _loadImg(element, attrs) {
        var newImage = new Image();
        // 继承class和style
        var newImageWrapper = angular.element(newImage);
        // 怪异bug
        newImageWrapper['attr']('style', attrs['style']);
        newImageWrapper['attr']('class', attrs['class']);
        // 根据image尺寸请求合适的图片
        $timeout(function() {
            var src = attrs['lazySrc'];
            // 后期通过dPR和屏幕宽度请求高清图
            // 但是一定要分段
            src += '!' + Math.ceil(window.screen.width * 1.6 * 0.5) + 'x' + 70 + '.jpg';
            newImage.src = src;
            // 加载成功替换节点
            newImage.onload = function() {
                element.replaceWith(newImage);
            };
        });
    };
    return _loadImg;
}]);
