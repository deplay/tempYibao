define(function() {
    var yb = angular.module('yibao', ['ionic', 'routes']);
    yb.config(function($controllerProvider, $compileProvider, $filterProvider, $provide, $ionicConfigProvider, $httpProvider) {
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
    });
    yb.run(function($state) {
        // $state.go('productList');
    });
    angular.element(document).ready(function() {
        var appEle = angular.element(document.body);
        angular.bootstrap(appEle, ['yibao']);
        appEle.removeClass('hide');
    });
    return yb;
});
