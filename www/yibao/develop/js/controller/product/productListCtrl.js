define(['yibao', 'productListService'], function(yibao, productListService) {
    yibao.controller('productListCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$productListService', function($scope, $state, $stateParams, $timeout, $productListService) {
        // 启动loading并防卡死
        function showLoading() {
            $scope.loading = true;
            $timeout(function() { $scope.loading = false }, 10000);
        }
        // 关闭loading
        function hideLoading() {
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        // 变量控制
        var shopCode = 'A003';
        var currentPage = 0;
        var pageSize = 10; //搜索结果排序方式
        var totalPages;
        $scope.hasData = true;
        $scope.moredata = true;
        // 样式控制初始化
        $scope.style = {
            one: false,
            price: false,
            reviews: false
        };
        $scope.doRefresh = function() {
            currentPage = 0;
            loadData();
        };

        $scope.loadMore = function() {
            if (!$scope.moredata) return;
            currentPage++;
            loadData();
        };

        function loadData() {
            //当前页等于总页数时，不请求数据；
            if (totalPages - currentPage === 0) {
                $scope.moredata = false;
                return
            }
            showLoading();
            $productListService
                .loadData(shopCode, currentPage, pageSize)
                .then(function(res) {
                    console.log('标记');

                    if (currentPage === 0) { //当前页面序号
                        console.log('分支1');
                        if (res.results.length === 0) {
                            $scope.hasData = false;
                        } else {
                            $scope.hasData = true;
                        }
                        totalPages = res.pagination.totalPages; //该分类的总数据
                        $scope.products = res.results;
                    } else if ((totalPages - currentPage >= 1) && currentPage > 0) { //加载更多
                        console.log('分支2');
                        Array.prototype.push.apply($scope.products, res.results);
                    } else { //没有更多数据
                        $scope.moredata = false;
                    }
                    hideLoading();
                }, function(err) {
                    console.log(err);
                });
        }
        // 页面加载首次执行
        loadData();
    }]);
});
