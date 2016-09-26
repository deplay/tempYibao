var yibaoCommon=angular.module("yibaoCommon",[]);yibaoCommon.constant("DEBUG",true).constant("SERVER",{url:"https://www1.hxyxt.com",testUrl:"https://stage.hxyxt.com"}).constant("URLMAP",{login:"/yxtws/oauth/token",productList:"/yxtws/v2/hxyxt/b2b2c/products/"});
yibaoCommon.service("$getUrl",["DEBUG","SERVER","URLMAP",function(DEBUG,SERVER,URLMAP){return function(key){var url=URLMAP[key];
if(!url){console.log("找不到对应的url地址");return}if(url.search("http://")!==-1){return url
}var fullUrl=DEBUG?SERVER.testUrl+url:SERVER.url+url;return fullUrl}}]);yibaoCommon.service("$data",["$cacheFactory","$localForage","$q","$http",function($cacheFactory,$localForage,$q,$http){var expires=30*60*1000;
var cacheMap=[/\/yxtws\/v2\/hxyxt\/b2b2c\/products\//];var self=this;this.set=function(nameSpace,key,value){var deferred=$q.defer();
var nameSpaceMemory=$cacheFactory.get(nameSpace)||$cacheFactory(nameSpace);nameSpaceMemory.put(key,value);
try{var nameSpaceLocal=$localForage.instance(nameSpace)}catch(e){var nameSpaceLocal=$localForage.createInstance({name:nameSpace})
}nameSpaceLocal.setItem(key,value);deferred.resolve();return deferred.promise};this.get=function(nameSpace,key,ajax,postAction,refresh){var deferred=$q.defer();
if(ajax){var keyJson=angular.toJson(key);notAjax(nameSpace,keyJson).then(function(res){if(!refresh&&res!==null&&(new Date).getTime()<res.expires){console.log("取缓存");
deferred.resolve(res)}else{console.log("取新值");$http(key).then(function(res){var storeData={res:res,expires:(new Date).getTime()+expires};
(postAction||angular.noop)(self,storeData);deferred.resolve(storeData);var flag=false;
angular.forEach(cacheMap,function(v,k,o){if(flag===true){return}if(v.test(key.url)){self.set("ajax",keyJson,storeData);
flag=true}})},function(err){console.log("内存和local无缓存且请求失败")})}})}else{notAjax(nameSpace,key).then(function(res){deferred.resolve(res)
})}return deferred.promise;function notAjax(nameSpace,key){var value;var nameSpaceMemory=$cacheFactory.get(nameSpace)||$cacheFactory(nameSpace);
value=nameSpaceMemory.get(key);if(value){return $q.resolve(value)}try{var nameSpaceLocal=$localForage.instance(nameSpace)
}catch(e){var nameSpaceLocal=$localForage.createInstance({name:nameSpace})}value=nameSpaceLocal.getItem(key);
return value}}}]);yibaoCommon.service("$user",["$q","$data","$getUrl",function($q,$data,$getUrl){var self=this;
this.login=function(loginObj){var deferred=$q.defer();var url=$getUrl("login");var dataObj={client_id:"mobile_android",client_secret:"secret",grant_type:"password"};
angular.extend(dataObj,loginObj);var postAction=function($data,storeData){$data.set("verification","hybrisToken",{token:storeData.res.data.access_token,expires:(new Date()).getTime()+storeData.res.data.expires_in*1000})
};$data.get("ajax",{url:url,method:"POST",data:dataObj},true,postAction).then(function(res){deferred.resolve(res)
});return deferred.promise};this.getToken=function(){var deferred=$q.defer();$data.get("verification","hybrisToken").then(function(token){if((new Date).getTime()>token.expires){}else{}deferred.resolve(token)
},function(err){console.log(err)});return deferred.promise}}]);yibaoCommon.directive("myLoading",function(){return{restrict:"E",replace:true,template:'<div class="myloading" ng-show="loading"><div class="loading-center"><div class="loading-center-absolute"><i class="ion-heart"></i></div></div></div>'}
});yibaoCommon.directive("myGoTop",function($compile,$timeout){return{scope:{},restrict:"E",require:"^$ionicScroll",link:function($scope,ele,attrs,controller){$scope.show=false;
var eleGoTop='<div class="gotop" ng-click="gotop()" ng-show="show"><i class="icon ion-arrow-up-c"></i></div>';
if(!attrs.hideCart){eleGoTop+='<div class="gocart" ng-click="$root.goTabs(2);"><i class="ion-ios-cart" "></i></div>'
}controller.$element.append($compile(eleGoTop)($scope));function setTop(){var top=controller.getScrollPosition().top;
var height=controller.$element[0].offsetHeight;$scope.$apply(function(){if(top>height){$scope.show=true
}else{$scope.show=false}})}var time=null;controller.$element.on("scroll",function(){if(time){$timeout.cancel(time)
}time=$timeout(setTop,30)});$scope.gotop=function(){controller.scrollTop(true)}}}
});