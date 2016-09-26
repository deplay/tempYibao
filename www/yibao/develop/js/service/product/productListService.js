define(['yibao'], function(yibao) {
    yibao.service('$productListService', ['$q', '$data', '$http', '$getUrl', function($q, $data, $http, $getUrl) {
        this.loadData = function(id, again, pageIndex, sort) {
            $data.set('ns1', 'hello', 'world');
            $data.get('ns1', 'hello').then(function(res) {
                console.log(res);
            })
            $data.get('ajax', {
                url: $getUrl('productList') + id,
                method: 'GET',
                params: {
                    q: again + ':relevance:productType:TUANGOU:productType:YXDJ',
                    page: pageIndex,
                    sort: sort,
                    channe: 'hxyxt'
                }
            }, true).then(function(res) {
                console.log(res);


                // 第二次获取
                $data.get('ajax', {
                    url: $getUrl('productList') + id,
                    method: 'GET',
                    params: {
                        q: again + ':relevance:productType:TUANGOU:productType:YXDJ',
                        page: pageIndex,
                        sort: sort,
                        channe: 'hxyxt'
                    }
                }, true).then(function(res) {
                    console.log(res);
                });
            });



            var deferred = $q.defer();
            var url = $getUrl('productList') + id;
            var paras = {
                q: again + ':relevance:productType:TUANGOU:productType:YXDJ',
                page: pageIndex,
                sort: sort,
                channe: 'hxyxt'
            }
            $http({
                url: url,
                method: 'GET',
                params: paras
            }).then(function(res) {
                deferred.resolve(res);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    }])
});
