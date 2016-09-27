define(['yibao'], function(yibao) {
    yibao.controller('regCtrl', ['$scope', '$timeout', 'toaster', '$verification', '$user', '$smsCode', function($scope, $timeout, toaster, $verification, $user, $smsCode) {
        var self = this;
        $scope.user = {
            cellphone: "",
            password: "",
            referee: '',
            registerYxdj: 'yibao',
            isok: false
        }

        var invalidMsg = {
                cellphone: {
                    required: '请输入手机号'
                },
                password: {
                    required: '请输入登录密码',
                    minlength: '密码长度为4-16位',
                    maxlength: '密码长度为4-16位'
                }
            }
            // 启动loading并防卡死
        function showLoading() {
            $scope.loading = true;
            $timeout(function() { $scope.loading = false }, 10000);
        }
        // 关闭loading
        function hideLoading() {
            $scope.loading = false;
        }

        function getInputError() {
            if (!self.myForm.$invalid) return false;
            var errorMsg = $verification.getInvalidMsg(self.myForm, invalidMsg);
            return errorMsg;
        }

        $scope.validateCode = function() {
            var errorMsg;
            if (errorMsg = getInputError()) {
                toaster.pop('error', errorMsg);
                return;
            }
            console.log($scope.user.cellphone);
            showLoading();
            $scope.btnEnable = false;
            $smsCode.validateCode($scope.user.cellphone).then(function(res) {
                console.log(res);
                hideLoading();
                if (res.indexOf('noPhoneNumber') > -1) {
                    toaster.pop('error', '手机号码不正确');
                    $scope.btnEnable = true;
                } else if (res.indexOf('phoneNumberAlready') > -1) {
                    toaster.pop('error', '手机号码已注册');
                    $scope.btnEnable = true;
                } else if (res.indexOf('noprivalige') > -1) {
                    toaster.pop('error', '手机号码获取频繁');
                    $scope.btnEnable = true;
                } else {
                    $scope.etime = 60; //60秒
                    $timeout(function() { //60秒后变为可用
                        $scope.btnEnable = true;
                    }, 60 * 1000);
                    var v = $interval(function() { //每秒执行一次，前端秒数减
                        $scope.etime -= 1;
                    }, 1000, 60)
                }

            }, function(msg, code) {
                $scope.btnEnable = true;
                hideLoading();
                toaster.pop('error', '网络连接错误！');
            });

        }
    }]);
});
