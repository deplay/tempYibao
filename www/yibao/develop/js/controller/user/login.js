define(['yibao'], function(yibao) {
    yibao.controller('loginCtrl', ['$scope', '$timeout', '$state', '$ionicHistory', 'toaster', '$verification', '$user', function($scope, $timeout, $state, $ionicHistory, toaster, $verification, $user) {
        var self = this; //提供引用

        $scope.loginObj = {};

        // 调试，后期删除
        $scope.loginObj.username = '700000000';
        $scope.loginObj.password = '123456';

        // 辅助函数
        // 启动loading并防卡死
        function showLoading() {
            $scope.loading = true;
            $timeout(function() { $scope.loading = false }, 10000);
        }
        // 关闭loading
        function hideLoading() {
            $scope.loading = false;
        }

        var invalidMsg = {
            username: '请输入有效的用户名',
            password: {
                required: '请输入登录密码',
                minlength: '密码长度为4-16位',
                maxlength: this.minlength
            }
        }


        function getInputError() {
            if (!self.myForm.$invalid) return false;
            var errorMsg = $verification.getInvalidMsg(self.myForm, invalidMsg);
            return errorMsg;
        }

        $scope.login = function() {
            var errorMsg;
            if (errorMsg = getInputError()) {
                toaster.pop('error', errorMsg);
                return;
            }
            showLoading();
            $user.login($scope.loginObj)
                .then(function(res) {
                    $timeout(function() {
                        console.log(res);
                        hideLoading();
                        var backView = $ionicHistory.backView();
                        if (backView) {
                            if (backView.stateName == 'updatepwd') {
                                $ionicHistory.goBack(-2);
                            } else {
                                $ionicHistory.goBack(-1);
                            }
                        } else {
                            $state.go('productList');
                        }
                    });
                }, function(res) {
                    hideLoading();
                    toaster.pop('error', '用户名或密码错误！');
                });
        }
    }]);
});
