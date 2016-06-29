angular.module('routes', [])

.config(function($stateProvider) {

    function asyncLoad(js) {
        return ["$q", "$rootScope", function($q, $rootScope) {
            var deferred = $q.defer();
            var dependencies = [];
            if (Array.isArray(js)) {
                dependencies = js;
            } else {
                dependencies.push(js);
            }
            require(dependencies, function() {
                $rootScope.$apply(function() {
                    deferred.resolve();
                });
            });
            return deferred.promise;
        }];
    }
    $stateProvider
        .state('single', {
            url: '/single',
            templateUrl: 'templates/single.html'
            // ,
            // resolve: {
            //     deps: asyncLoad('js/controller/singleCtrl')
            // }
        })


})







;
