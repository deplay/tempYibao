console.log('执行1');
define(['yibao', 'userService'], function(yibao, userService) {
    console.log('执行2');
    yibao.service('$productListService', ['$http', '$getUrl', function($http, $getUrl) {
        console.log('service');
        this.loadData = function() {
            console.log($getUrl('productList'));
        };

        this.getClassifyList = function(classifyID, classifyAgainSearch, pageIndex, sorts) { //分类编码以及分类再搜索
            var deferred = $q.defer();
            var url = $makeUrlService('classifySearch');
            url += classifyID;
            var paras = {
                //:relevance:productType:TUANGOU:productType:YXDJ
                // q: classifyAgainSearch + ":relevance:isYXDJ:true",
                q: classifyAgainSearch + ":relevance:productType:TUANGOU:productType:YXDJ",
                page: pageIndex,
                sort: sorts,
                channe: "hxyxt"
            }
            url = $makeUrlService(url, paras);
            $http.get(url).success(function(datas) {
                deferred.resolve(datas);
            }).error(deferred.reject);
            return deferred.promise;
        };

    }])
});
