define(["yibao"],function(yibao){console.log("执行2");yibao.service("$productListService",["$q","$http","$getUrl",function($q,$http,$getUrl){console.log("service");
this.loadData=function(id,again,pageIndex,sort){var deferred=$q.defer();var url=$getUrl("productList")+id;
var paras={q:again+":relevance:productType:TUANGOU:productType:YXDJ",page:pageIndex,sort:sort,channe:"hxyxt"};
console.log(url);$http({url:url,method:"GET",params:paras}).then(function(res){deferred.resolve(res)
},function(err){deferred.reject(err)});return deferred.promise}}])});