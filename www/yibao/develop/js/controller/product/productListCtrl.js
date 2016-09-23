define(['yibao', 'productListService'], function(yibao, productListService) {
    yibao.controller('productListCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$productListService', function($scope, $state, $stateParams, $timeout, $productListService) {
        // 启动loading并防卡死
        function showLoading() {
            $scope.loading = true;
            $timeout(function() { $scope.loading = false }, 10000);
        }
        // 关闭loading并
        function hideLoading() {
            $scope.loading = false;
        }

        var code = 'YXT520010001';
        var pageIndex = -1;
        var sorts = 'relevance'; //搜索结果排序方式


        function loadData() {
            showLoading();
            $productListService
                .loadData(code, '', pageIndex, sorts)
                .then(function(res) {
                    console.log(res);
                    $scope.productsList = res.data.products;
                    hideLoading();
                }, function(err) {
                    console.log(err);
                });
        }
        // 页面加载首次执行
        loadData();
        // 样式控制初始化
        $scope.style = {
            one: false,
            price: false,
            reviews: false
        };
        // 头部排序方式选择
        //选择排序方式
        var tabs = [
                { tag: '综合', sort: 'relevance' },
                { tag: '热搜', sort: 'topRated' },
                { tag: '销量', sort: 'saleAmount' },
                { tag: '价格从低到高', sort: 'price-asc' },
                { tag: '价格从高到低', sort: 'price-desc' },
                { tag: '评价从低到高', sort: 'reviews-asc' },
                { tag: '评价从高到低', sort: 'reviews-desc' }
            ]
            //切换    
        $scope.tabindex = $stateParams.index == '' || $stateParams.index == undefined ? 0 : parseInt($stateParams.index);
        $scope.changeIndex = function(i) {
                $scope.tabindex = i;
                // $scope.$parent.loading = true;
                sorts = tabs[i].sort;
                // init();
            }
            // 下拉刷新
        $scope.doRefresh = function() {
            // pageIndex = 0;
            // loadData();
        }
    }]);
});
