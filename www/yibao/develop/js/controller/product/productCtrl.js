define(['yibao', 'productService'], function(yibao, productService) {


    yibao.directive('yibaoSlider', ['$compile', function($compile) {
        var tpl =
            '<ion-slides options="options" slider="data.slider" class="sliderCon">' +
            '<ion-slide-page ng-repeat="(k,v) in details.images">' +
            '<lazy-img lazy-src="{{v}}" class="sliderImg "></lazy-img>' +
            '</ion-slide-page>' +
            '</ion-slides>';
        return {
            require: ['^ngController'],
            link: function(scope, ele, attrs, ctrls) {
                ctrls[0].sliderPromise.then(function(details) {
                    scope.details = details;
                    var output = $compile(tpl)(scope);
                    output.addClass('sliderCon');
                    ele.replaceWith(output);
                });
            }
        };
    }]);


    yibao.controller('productCtrl', ['$scope', '$q', '$state', '$stateParams', '$timeout', '$productService', 'productImgsFilter', function($scope, $q, $state, $stateParams, $timeout, $productService, productImgsFilter) {
        var self = this;

        // 启动loading并防卡死
        function showLoading() {
            $scope.loading = true;
            $timeout(function() { $scope.loading = false }, 10000);
        }
        // 关闭loading
        function hideLoading() {
            // $scope.slider.updateLoop();
            $scope.loading = false;
        }

        $scope.options = {
            loop: true,
            speed: 500,
        }

        $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
            // data.slider is the instance of Swiper
            $scope.slider = data.slider;
        });

        var code = $stateParams.code;
        var deferredSlider = $q.defer();
        self.sliderPromise = deferredSlider.promise;



        function loadData() {
            console.log('执行');
            showLoading();
            $productService.loadData(code).then(function(res) {
                res.images = productImgsFilter(res.images)
                self.details = res;
                console.log(res);
                deferredSlider.resolve(res);
                hideLoading();
            }, function(err) {
                hideLoading();
                console.log(err);
            });
        };
        loadData(); //页面初始化执行
    }]);
});
