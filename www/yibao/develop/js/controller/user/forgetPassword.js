define(['yibao', 'forgetPasswordService'], function(yibao, forgetPasswordService) {

    yibao.controller('forgetPwdCtrl', ['$scope','$ionicSlideBoxDelegate', function($scope,$ionicSlideBoxDelegate) {
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

    yibao.controller('frguserCtrl', ['$scope', function($scope) {

    }]);

    yibao.controller('frgvipCtrl', ['$scope', function($scope) {

    }]);
});
