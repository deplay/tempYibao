console.log('userService执行1');
define(['yibao'], function(yibao) {
    yibao.service('$userService', ['$q', '$http', '$getUrl', function($q, $http, $getUrl) {
        function localData() {

            return {};
        }
        this.login = function(loginObj) {
            // 临时数据
            loginObj.username = '18788501173';
            loginObj.password = '18788501173';
            // 正式代码
            var deferred = $q.defer();
            var url = $getUrl('login');
            console.log(url);
            var dataObj = {
                client_id: 'mobile_android',
                client_secret: 'secret',
                grant_type: 'password'
            };
            angular.extend(dataObj, loginObj);
            $http({
                url: url,
                method: 'POST',
                data: dataObj
            }).then(function(res) {
                console.log(res);
                deferred.resolve(res);
            }, function(err) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.getToken = function(loginObj) {
            var deferred = $q.defer();
            var token = localData()['access_token'];
            if (token) {
                deferred.resolve(token);
            } else {
                if (!loginObj) {
                    console.log('既没有缓存token也未提供登录信息');
                } else {
                    this.login(loginObj)
                        .then(function(res) {

                        }, function(err) {

                        });
                }
            }
            return deferred.promise;
        };
    }])
});
