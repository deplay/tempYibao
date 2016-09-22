angular.module('routes', [])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        function loadCss(css) {
            return ['$q', '$rootScope', function($q, $rootScope) {
                var deferred = $q.defer();
                var dependencies = [];
                if (Array.isArray(css)) {
                    dependencies = css;
                } else {
                    dependencies.push(css);
                }
                deferred.resolve();
                return deferred.promise;
            }];
        }

        function loadTpl(tpl) {
            return ['$q', '$rootScope', '$templateRequest', function($q, $rootScope, $templateRequest) {
                var dependencies = [];
                if (Array.isArray(tpl)) {
                    dependencies = tpl;
                } else {
                    dependencies.push(tpl);
                }
                // console.log($templateRequest('\\html\\product\\productList.min.html'));
                var proArr = []
                angular.forEach(tpl, function(v, k, o) {
                        proArr.push($templateRequest(v));
                    })
                    // console.log(proArr);
                return $q.all(proArr);
            }];
        }

        // load js
        function asyncLoad(data) {
            return ['$q', '$rootScope', function($q, $rootScope) {
                var deferred = $q.defer();
                var dependencies = [];
                if (Array.isArray(data)) {
                    dependencies = data;
                } else {
                    dependencies.push(data);
                }
                require(dependencies, function() {
                    $rootScope.$apply(function() {
                        deferred.resolve();
                    });
                });
                return deferred.promise;
            }];
        }
        $stateProvider
            .state('productList', {
                url: '/productList',
                templateProvider: loadTpl(['\\html\\product\\productList.min.html']),
                resolve: {
                    js: asyncLoad(['controller/productListCtrl']),
                    html: loadTpl(['\\html\\product\\productList.min.html'])//,css: loadCss([''])
                }
            })





    }])
