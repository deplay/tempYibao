define(['yibao', 'productService'], function(yibao, productService) {
    yibao.controller('productCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$productService', function($scope, $state, $stateParams, $timeout, $productService) {
        // 启动loading并防卡死
        function showLoading() {
            $scope.loading = true;
            $timeout(function() { $scope.loading = false }, 10000);
        }
        // 关闭loading
        function hideLoading() {
            $scope.loading = false;
        }

        var code = $stateParams.code;

        function loadData() {
            console.log('执行');
            showLoading();
            $productService.loadData(code).then(function(res) {
                console.log(res);
                hideLoading();
            }, function(err) {
                hideLoading();
                console.log(err);
            });
        };

        loadData(); //页面初始化执行
    }]);
});
