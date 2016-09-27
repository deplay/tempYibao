angular.module('routes', [])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        function loadCss(css) {
            return ['$q', '$rootScope', function($q, $rootScope) {
                var dependencies = [];
                if (Array.isArray(css)) {
                    dependencies = css;
                } else {
                    dependencies.push(css);
                }
                var proArr = []
                angular.forEach(dependencies, function(v, k, o) {
                        var deferred = $q.defer();
                        var el = document.createElement('link');
                        el.onload = el['onreadystatechange'] = function(e) {
                            if (el['readyState'] && !/^c|loade/.test(el['readyState'])) return;
                            el.onload = el['onreadystatechange'] = null;
                            deferred.resolve();
                        };
                        el.onerror = function() {
                            deferred.reject(new Error('Unable to load ' + path));
                        };
                        el.type = 'text/css';
                        el.rel = 'stylesheet';
                        el.href = v;
                        var insertBeforeElem = document.head.lastChild;
                        insertBeforeElem.parentNode.insertBefore(el, insertBeforeElem);
                        proArr.push(deferred.promise);
                    })
                    // console.log(proArr);
                return $q.all(proArr);
            }];
        };

        function loadTpl(tpl) {
            return ['$q', '$rootScope', '$templateRequest', function($q, $rootScope, $templateRequest) {
                var dependencies = [];
                if (Array.isArray(tpl)) {
                    dependencies = tpl;
                } else {
                    dependencies.push(tpl);
                }
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
                templateProvider: loadTpl(['/html/product/productList.html']),
                resolve: {
                    js: asyncLoad(['controller/product/productListCtrl']),
                    css: loadCss('/css/product/productList.css')
                }
            });

        $stateProvider
            .state('login', {
                url: '/login',
                templateProvider: loadTpl(['/html/user/login.html']),
                resolve: {
                    js: asyncLoad(['controller/user/login']),
                    css: loadCss('/css/user/login.css')
                }
            });

        $stateProvider
            .state('register', {
                url: '/register',
                templateProvider: loadTpl(['/html/user/register.html']),
                resolve: {
                    js: asyncLoad(['controller/user/register']),
                    css: loadCss('/css/user/register.css')
                }
            });

        $stateProvider
            .state('forgetPassword', {
                url: '/forgetPassword',
                templateProvider: loadTpl(['\\html\\user\\forgetPassword.html']),
                resolve: {
                    js: asyncLoad(['controller/user/forgetPassword']),
                    css: loadCss('\\css\\user\\forgetPassword.css')
                }
            });    

        $stateProvider
            .state('confirmOrder', {
                url: '/confirmOrder',
                templateProvider: loadTpl(['/html/order/confirmOrder.html']),
                resolve: {
                    js: asyncLoad(['controller/order/confirmOrder']),
                    css: loadCss('/css/order/confirmOrder.css')
                }
            });




    }])
