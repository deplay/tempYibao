// 存放共用的constant service directive filter等
var yibaoCommon = angular.module('yibaoCommon', []);


// 常数
yibaoCommon.constant('DEBUG', true)
    .constant('SERVER', {
        url: 'https://www1.hxyxt.com',
        testUrl: 'https://stage.hxyxt.com'
    })
    .constant('URLMAP', {
        login: '/yxtws/oauth/token',
        productList: '/yxtws/v1/hxyxt/yinhai/',
        product: '/yxtws/v1/hxyxt/yinhai/product/',
        validateCode: '/yxtws/v1/hxyxt/customers/smsValidateCode', //获取验证码
        getuserCode: '/yxtws/v1/hxyxt/passreset/request/staffyanzhengma', //员工密码找回获取验证码
        userSetpwd: '/yxtws/v1/hxyxt/passreset/request/staff', //员工密码修改
        getvipCode: '/yxtws/v1/hxyxt/passreset/sendmassage', //会员密码找回获取验证码
        vipSetpwd: '/yxtws/v1/hxyxt/passreset/resetpass', //会员密码修改
    });
// 服务
yibaoCommon.service('$getUrl', ['DEBUG', 'SERVER', 'URLMAP', function(DEBUG, SERVER, URLMAP) {
    return function(key) {
        var url = URLMAP[key];
        if (!url) {
            console.log('找不到对应的url地址');
            return
        }
        if (url.search('http://') !== -1) return url;
        var fullUrl = DEBUG ? SERVER.testUrl + url : SERVER.url + url;
        return fullUrl;
    };
}]);

yibaoCommon.service('$verification', [function() {
        this.getInvalidMsg = function(form, invalidMsg) {
            for (input in invalidMsg) {
                if (form[input].$valid) continue;
                var errors = invalidMsg[input];
                if (angular.isObject(errors)) {
                    for (error in errors) {
                        if (form[input].$error[error]) {
                            return errors[error];
                        }
                    }
                    return input + ' error!';
                } else {
                    return errors;
                }
            }
        }
    }])
    // 数据服务
yibaoCommon.service('$data', ['$cacheFactory', '$localForage', '$q', '$http', '$state', 'toaster', function($cacheFactory, $localForage, $q, $http, $state, toaster) {
    // 配置
    // 有效期,单位毫秒
    var expires = 30 * 60 * 1000;

    // 要缓存的正则
    // 首页，搜索列表，详情页
    var cacheMap = [
        /\/yxtws\/v2\/hxyxt\/b2b2c\/products\//
    ];

    // 为内层函数提供引用
    var self = this;
    // set
    this.set = function(nameSpace, key, value) {
        var deferred = $q.defer();
        var nameSpaceMemory = $cacheFactory.get(nameSpace) || $cacheFactory(nameSpace);
        nameSpaceMemory.put(key, value);
        try {
            var nameSpaceLocal = $localForage.instance(nameSpace);
        } catch (e) {
            var nameSpaceLocal = $localForage.createInstance({ name: nameSpace });
        }
        nameSpaceLocal.setItem(key, value);
        deferred.resolve();
        return deferred.promise;
    };

    // get
    this.get = function(nameSpace, key, ajax, postAction, refresh) {
        var deferred = $q.defer();
        if (ajax) { //处理ajax的刷新和缓存
            var keyJson = angular.toJson(key);
            notAjax(nameSpace, keyJson).then(function(res) {
                if (!refresh && res !== null && (new Date).getTime() < res.expires) {
                    console.log('取缓存');
                    deferred.resolve(res);
                } else {
                    console.log('取新值');
                    $http(key).then(function(res) {
                        var storeData = {
                            std: res,
                            expires: (new Date).getTime() + expires
                        };
                        (postAction || angular.noop)(self, storeData);
                        deferred.resolve(storeData); //提交给请求程序使用
                        var flag = false;
                        angular.forEach(cacheMap, function(v, k, o) {
                            if (flag === true) return;
                            if (v.test(key.url)) {
                                self.set('ajax', keyJson, storeData); //存储
                                flag = true;
                            }
                        });
                    }, function(err) {
                        if (err.data.errors[0].type === 'AccessDeniedError') {
                            toaster.error('token无效');
                            // $state.go('login');
                        }
                        console.log('内存和local无缓存且请求失败');
                    });
                }
            })
        } else { //普通
            notAjax(nameSpace, key).then(function(res) {
                deferred.resolve(res);
            })
        }
        return deferred.promise;

        function notAjax(nameSpace, key) {
            var value;
            var nameSpaceMemory = $cacheFactory.get(nameSpace) || $cacheFactory(nameSpace);
            value = nameSpaceMemory.get(key);
            if (value) return $q.resolve(value);
            try {
                var nameSpaceLocal = $localForage.instance(nameSpace);
            } catch (e) {
                var nameSpaceLocal = $localForage.createInstance({ name: nameSpace });
            }
            value = nameSpaceLocal.getItem(key);
            return value;
        };
    };
}]);

yibaoCommon.service('$user', ['$q', 'toaster', '$data', '$getUrl', function($q, toaster, $data, $getUrl) {
    var self = this;
    this.login = function(loginObj) {
        // 正式代码
        var deferred = $q.defer();
        var url = $getUrl('login');
        var dataObj = {
            client_id: 'mobile_android',
            client_secret: 'secret',
            grant_type: 'password'
        };
        angular.extend(dataObj, loginObj);
        var postAction = function($data, storeData) {
            $data.set('verification', 'hybrisToken', {
                token: storeData.res.data['access_token'],
                expires: (new Date()).getTime() + storeData.res.data.expires_in * 1000
            });
        };
        $data.get('ajax', {
            url: url,
            method: 'POST',
            data: dataObj //params
        }, true, postAction).then(function(res) {
            deferred.resolve(res);
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    this.getToken = function() {
        var deferred = $q.defer();
        $data.get('verification', 'hybrisToken').then(function(token) {
            console.log(token);
            if ((new Date).getTime() > token.expires) {
                toaster.error('token过期');
                // state.go('login');
            } else {
                // console.log('token有效');
            }
            deferred.resolve(token);
        }, function(err) {
            console.log(err);
            toaster.error('没有缓存好的token');
            // state.go('login');
        });
        return deferred.promise;
    };

    this.register = function() {

    };

    this.forgetPwd = function() {

    };
}]);

yibaoCommon.service('smsCode', ['$data', function($data) {


}]);


// 指令
yibaoCommon.directive('myLoading', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="myloading" ng-show="loading">' +
            '<div class="loading-center">' +
            '<div class="loading-center-absolute">' +
            '<i class="ion-heart"></i>' +
            '</div>' +
            '</div>' +
            '</div>'
    };
});
yibaoCommon.directive('myGoTop', function($compile, $timeout) {
    return {
        scope: {},
        restrict: 'E',
        require: '^$ionicScroll',
        link: function($scope, ele, attrs, controller) {
            $scope.show = false;
            var eleGoTop = '<div class="gotop" ng-click="gotop()" ng-show="show"><i class="icon ion-arrow-up-c"></i></div>';
            if (!attrs.hideCart) eleGoTop += '<div class="gocart" ng-click="$root.goTabs(2);"><i class="ion-ios-cart" "></i></div>';
            controller.$element.append($compile(eleGoTop)($scope));

            function setTop() {
                var top = controller.getScrollPosition().top;
                var height = controller.$element[0].offsetHeight;
                $scope.$apply(function() {
                    if (top > height) $scope.show = true;
                    else $scope.show = false;
                });
            }
            var time = null;
            controller.$element.on('scroll', function() {
                if (time) $timeout.cancel(time);
                time = $timeout(setTop, 30);
            });
            $scope.gotop = function() {
                controller.scrollTop(true);
            }
        }
    };
});
yibaoCommon.directive("exposureForm", [
    function() {
        return {
            require: "^ngController",
            link: function(scope, ele, attrs, ctrls) {
                var name = attrs.name;
                ctrls[name] = scope[name];
            }
        };
    }
]);

yibaoCommon.directive("numberInput", function() {
    var tpl =
        '<div class="number-input-container" id="number-input-container-id">\n' +
        '    <label ng-if="numberInput.hasPrefix()" id="number-input-prefix-id">{{numberInput.prefix}}</label>\n' +
        '        <button type="button" class="button number-input-minus" ng-click="numberInput.dec()">\n' +
        '            <strong>-</strong>\n' +
        '        </button>\n' +
        '    <input type="text" class= form-control number-input text-left" ng-model="model" ng-change="numberInput.onChange()" ng-keydown="numberInput.onKeyPress($event)" ng-blur="numberInput.onBlur()" ng-style="numberInput.getWidth()" ng-class="{&#39;number-input-no-postfix&#39;: !numberInput.hasPostfix()}"></input>\n' +
        '    <label ng-if="numberInput.hasPostfix()" id="number-input-postfix-id" class="number-input-fix number-input-postfix">{{numberInput.postfix}}</label>\n' +
        '        <button type="button" class="button number-input-plus" ng-click="numberInput.inc()" ng-class="{&#39;number-input-plus-no-postfix&#39;: !numberInput.hasPostfix()}">\n' +
        '            <strong>+</strong>\n' +
        '        </button>\n' +
        '</div>\n' +
        '';
    return {
        restrict: 'E',

        template: tpl,

        scope: {
            model: "=ngModel",
            onChange: "&ngChange",
            start: "=?start",
            min: "=?min",
            max: "=?max",
            step: "=?step",
            hint: "@?hint",
            hideHint: "=?hideHint",
            disableDecimal: "=?disableDecimal",
            decimalPlaces: "=?decimalPlaces",
            prefix: "@?prefix",
            postfix: "@?postfix",
            options: "=?options"
        },

        controller: ["$scope", function($scope) {

            // used to validate key presses
            var prevKey = null;

            var KEY_ZERO = 48;
            var KEY_NINE = 57;
            var KEY_PERIOD = 190;
            var KEY_DASH = 189;
            var KEY_SPACE = 32;

            // allow custom onChange functions
            $scope.$watch("model", function() {
                $scope.onChange();
            });

            // increment model by step
            this.inc = function() {
                if (isMaxed() || prevKey != null)
                    return;

                $scope.model += $scope.step;
                validate();
            };

            // decrement model by step
            this.dec = function() {
                if (isMinnd() || prevKey != null)
                    return;

                $scope.model -= $scope.step;
                validate();
            };

            this.onKeyPress = function(e) {
                if (e.keyCode == KEY_SPACE)
                    validate();

                if (validKey(e.keyCode))
                    prevKey = e.keyCode;
            };

            this.onChange = function() {
                if (!isModelMaxLength()) {
                    return;
                }

                // skip validation for certain keys
                if (prevKey == KEY_PERIOD ||
                    prevKey == KEY_DASH ||
                    (prevKey == KEY_ZERO && numberHasDecimal($scope.model))) return;

                validate();
            };

            // when the input goes out of focus
            this.onBlur = function() {
                validate();
                if (!$scope.model)
                    $scope.model = $scope.start || 0;
            };

            this.hasPrefix = function() {
                return !this.prefix == "";
            };

            this.hasPostfix = function() {
                return !this.postfix == "";
            };


            function width(selector) {
                var target = document.querySelector(selector);
                return target ? target : 0;
            };


            this.getWidth = function() {
                try {
                    var w = 0;

                    if (this.hasPrefix() && this.hasPostfix()) {
                        w = width("#number-input-prefix-id") +
                            width("#number-input-postfix-id")
                    } else if (this.hasPrefix()) {
                        w = width("#number-input-prefix-id")
                    } else if (this.hasPostfix()) {
                        w = width("#number-input-postfix-id")
                    }

                    return {
                        width: width("#number-input-container-id") -
                            width("#number-input-btns-container-id") - w
                    };
                } catch (e) {
                    console.log(e);
                }

            };

            var isModelMaxLength = function() {
                if (!isMaxValid() || !isMinValid())
                    return true;

                // the length of the input only needs to be checked if both the max AND min are
                // 1. positive
                // 2. negative
                if (!(($scope.max >= 0 && $scope.min >= 0) || ($scope.max <= 0 && $scope.min <= 0)))
                    return true;

                // make sure decimal places are accounted for in model length
                var decimalLen = $scope.decimalPlaces + ($scope.decimalPlaces > 0 ? 1 : 0);

                var maxStrLen = $scope.max.toString().length + decimalLen;
                var minStrLen = $scope.min.toString().length + decimalLen;
                var maxLen = (maxStrLen > minStrLen) ? maxStrLen : minStrLen;

                var modelStr = $scope.model.toString();
                var numberOfDecimals = getDecimalPlaces(modelStr);

                // max string length
                // 1. actual string length
                // 2. max decimal places
                if (modelStr.length > maxLen || numberOfDecimals > $scope.decimalPlaces) {
                    $scope.model = parseFloatForModel(modelStr.substring(0, modelStr.length - 1));
                }

                return (maxLen == $scope.model.toString().length) || (numberOfDecimals > 0 && numberOfDecimals == $scope.decimalPlaces);
            }

            var getHint = function() {
                // hide hint if no max/min were given
                if ((!isMaxValid() && !isMinValid()))
                    return $scope.hideHint = true;

                // user specified hint
                if ($scope.hint)
                    return $scope.hint;

                if ($scope.options.hint)
                    return $scope.options.hint;

                // hint if only a maximum was specified
                if (isMaxValid() && !isMinValid())
                    return "Less than or equal to " + $scope.max;

                // hint if only a minimum was specified
                if (isMinValid() && !isMaxValid())
                    return "Greater than or equal to " + $scope.min;

                // hint if both a maximum and minimum was specified
                if (isMaxValid() && isMinValid())
                    return $scope.min + " to " + $scope.max;
            };

            // returns true if the model is >= the maximum
            var isMaxed = function() {
                return isMaxValid() && $scope.model >= $scope.max;
            };

            // returns true if the model is <= the minimum
            var isMinnd = function() {
                return isMinValid() && $scope.model <= $scope.min;
            };

            var isMaxValid = function() {
                return !isNull($scope.max);
            };

            var isMinValid = function() {
                return !isNull($scope.min);
            };

            var isNull = function(num) {
                return (num === null) || (num === undefined) || (num === NaN);
            };

            var numberHasDecimal = function(num) {
                return num.toString().indexOf(".") > -1;
            };

            var canGoNegative = function() {
                return (!isMinValid() || $scope.min < 0);
            };

            var validKey = function(key) {
                return (key >= KEY_ZERO && key <= KEY_NINE) ||
                    (key == KEY_DASH && canGoNegative()) ||
                    (key == KEY_PERIOD && !$scope.disableDecimal && !($scope.decimalPlaces == 0));
            };

            var parseFloatForModel = function(string) {
                return +parseFloat(string).toFixed($scope.decimalPlaces);
            };

            // validates the current model
            // if it is higher/lower than max/min, will reset to max/min
            var validate = function() {
                $scope.model = parseFloatForModel($scope.model);

                if (isMaxed()) $scope.model = $scope.max;
                if (isMinnd()) $scope.model = $scope.min;

                prevKey = null;
            };

            // returns the number of decimal places in $scope.step
            var getDecimalPlaces = function(str) {
                if (str.indexOf(".") >= 0)
                    return str.split(".")[1].length;
                return 0;
            };

            if (!$scope.options) $scope.options = {};

            // defaults
            if (isNull($scope.min)) $scope.min = $scope.options.min;
            if (isNull($scope.max)) $scope.max = $scope.options.max;

            // may still end up as null, which is okay
            if (isNull($scope.start)) $scope.start = $scope.options.start;
            if (isNull($scope.start)) $scope.start = $scope.min;

            $scope.step = $scope.step || $scope.options.step || 1;
            $scope.hint = this.hint = getHint();
            $scope.hideHint = $scope.hideHint || $scope.options.hideHint || false;
            $scope.disableDecimal = $scope.disableDecimal || $scope.options.disableDecimal || false;
            $scope.decimalPlaces = $scope.decimalPlaces || $scope.options.decimalPlaces || getDecimalPlaces($scope.step.toString());
            $scope.model = $scope.start || $scope.model || 0;
            $scope.prefix = this.prefix = $scope.prefix || $scope.options.prefix || "";
            $scope.postfix = this.postfix = $scope.postfix || $scope.options.postfix || "";
        }],

        controllerAs: "numberInput"
    };
});



// filter
yibaoCommon.filter('productImgs', function() {
    return function(images) {
        var imgs = [];
        angular.forEach(images, function(img) {
            if (img.format == "superZoom" && img.imageType == "GALLERY") {
                imgs.push(img.url);
            }
        })
        return imgs;
    }
})
