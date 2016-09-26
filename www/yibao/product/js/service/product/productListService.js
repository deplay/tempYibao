define(["yibao"],function(yibao){yibao.service("$productListService",["$q","$data","$http","$getUrl",function($q,$data,$http,$getUrl){this.loadData=function(id,again,pageIndex,sort){$data.set();
var deferred=$q.defer();var url=$getUrl("productList")+id;var paras={q:again+":relevance:productType:TUANGOU:productType:YXDJ",page:pageIndex,sort:sort,channe:"hxyxt"};
$http({url:url,method:"GET",params:paras}).then(function(res){deferred.resolve(res)
},function(err){deferred.reject(err)});return deferred.promise}}])});