define(['yibao'], function(yibao) {
    yibao.service('$productListService', ['$q', '$data', '$getUrl', '$user', function($q, $data, $getUrl, $user) {
        this.loadData = function(shopCode, currentPage, pageSize) {
            var deferred = $q.defer();
            var url = $getUrl('productList') + shopCode;
            $user.getToken().then(function(tokenObj) {
                $data.get('ajax', {
                    url: url,
                    method: 'GET',
                    params: {
                        currentPage: currentPage,
                        pageSize: pageSize,
                        access_token: tokenObj.token
                    }
                }, true).then(function(res) {
                    deferred.resolve(res.res.data);
                }, function(err) {
                    deferred.reject(err);
                });
            })
            return deferred.promise;
        };
    }])
});
