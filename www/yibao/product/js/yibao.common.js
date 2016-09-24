var yibaoCommon=angular.module("yibaoCommon",[]);yibaoCommon.constant("DEBUG",false).constant("SERVER",{url:"https://www1.hxyxt.com",testUrl:"https://stage.hxyxt.com"}).constant("URLMAP",{login:"/yxtws/oauth/token",productList:"/yxtws/v1/hxyxt/category/yxdj/"});
yibaoCommon.service("$getUrl",["DEBUG","SERVER","URLMAP",function(DEBUG,SERVER,URLMAP){console.log(SERVER);
console.log(DEBUG);return function(key){var url=URLMAP[key];if(!url){console.log("找不到对应的url地址");
return}if(url.search("http://")!==-1){return url}var fullUrl=DEBUG?SERVER.testUrl+url:SERVER.url+url;
return fullUrl}}]);yibaoCommon.directive("myLoading",function(){return{restrict:"E",replace:true,template:'<div class="myloading" ng-show="loading"><div class="loading-center"><div class="loading-center-absolute"><i class="ion-heart"></i></div></div></div>'}
}).directive("myGoTop",function($compile,$timeout){return{scope:{},restrict:"E",require:"^$ionicScroll",link:function($scope,ele,attrs,controller){$scope.show=false;
var eleGoTop='<div class="gotop" ng-click="gotop()" ng-show="show"><i class="icon ion-arrow-up-c"></i></div>';
if(!attrs.hideCart){eleGoTop+='<div class="gocart" ng-click="$root.goTabs(2);"><i class="ion-ios-cart" "></i></div>'
}controller.$element.append($compile(eleGoTop)($scope));function setTop(){var top=controller.getScrollPosition().top;
var height=controller.$element[0].offsetHeight;$scope.$apply(function(){if(top>height){$scope.show=true
}else{$scope.show=false}})}var time=null;controller.$element.on("scroll",function(){if(time){$timeout.cancel(time)
}time=$timeout(setTop,30)});$scope.gotop=function(){controller.scrollTop(true)}}}
});