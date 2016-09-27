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
])
