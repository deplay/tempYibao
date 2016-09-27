define(['yibao'], function(yibao) {
    yibao.service('$productService', ['$q', '$data', '$getUrl', '$user', function($q, $data, $getUrl, $user) {
        this.loadData = function(code) {
            var deferred = $q.defer();
            var url = $getUrl('product') + code;
            $data.get('ajax', {
                url: url,
                method: 'GET'
            }, true).then(function(res) {
                deferred.resolve(res.std.data);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
    }])
});