define(['yibao', 'shoppingCartService'], function(yibao, shoppingCartService) {

    yibao.controller('cartCtrl', ['$scope','$ionicSlideBoxDelegate', function($scope,$ionicSlideBoxDelegate) {
        console.log('忘记密码页面初始化');
        $scope.tabs = [{ tag: '一心堂员工' }, { tag: '一心堂会员' }]
        $scope.tabVisible = true;
        $scope.tabclick = function(i) {
            $ionicSlideBoxDelegate.slide(i);
        }
        $scope.slideHasChanged = function(i) {
            $scope.tabVisible = !$scope.tabVisible;
        }
    }]);
});
