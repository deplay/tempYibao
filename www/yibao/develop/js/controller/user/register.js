define(['yibao'], function(yibao) {
    yibao.controller('regCtrl', ['$scope', '$timeout', '$state', '$ionicHistory', 'toaster', '$verification', '$user', function($scope, $timeout, $state, $ionicHistory, toaster, $verification, $user) {
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

        console.log(invalidMsg);
    }]);
});
