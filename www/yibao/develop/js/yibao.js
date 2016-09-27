define(function() {
    var yb = angular.module('yibao', ['ionic', 'LocalForageModule','toaster', 'lazyImg', 'yibaoCommon', 'routes']);
    yb.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ionicConfigProvider', '$httpProvider', function($controllerProvider, $compileProvider, $filterProvider, $provide, $ionicConfigProvider, $httpProvider) {
        $httpProvider.defaults.cache = false;
        yb.controller = $controllerProvider.register;
        yb.directive = $compileProvider.directive;
        yb.filter = $filterProvider.register;
        yb.service = $provide.service;
        $ionicConfigProvider.scrolling.jsScrolling(true);
        $ionicConfigProvider.backButton.text('返回').icon('ion-chevron-left');
        $ionicConfigProvider.views.maxCache(20);
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.tabs.style("standard");
        $ionicConfigProvider.tabs.position("bottom");
        $ionicConfigProvider.navBar.alignTitle("center");
        $ionicConfigProvider.navBar.positionPrimaryButtons('left');
        $ionicConfigProvider.navBar.positionSecondaryButtons('right');
        $ionicConfigProvider.views.swipeBackEnabled(true);
        $ionicConfigProvider.views.forwardCache(false);
    }]);

    yb.config(['$httpProvider', function($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }]);















    yb.run(['$state', '$rootScope', function($state, $rootScope) {
        $rootScope.cImg = function(url, rate, md) {
                url += '!' + Math.ceil(window.screen.width * 1.6 * rate) + 'x' + md + '.jpg';
                return url;
            }
            // $state.go('productList');
    }]);
    angular.element(document).ready(function() {
        var appEle = angular.element(document.body);
        angular.bootstrap(appEle, ['yibao']);
        appEle.removeClass('hide');
    });
    return yb;
});
