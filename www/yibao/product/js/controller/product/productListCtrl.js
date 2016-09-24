define(["yibao","productListService"],function(yibao,productListService){yibao.controller("productListCtrl",["$scope","$state","$stateParams","$timeout","$productListService",function($scope,$state,$stateParams,$timeout,$productListService){function showLoading(){$scope.loading=true;
$timeout(function(){$scope.loading=false},10000)}function hideLoading(){$scope.loading=false
}var code="YXT520010001";var pageIndex=-1;var sorts="relevance";function loadData(){showLoading();
$productListService.loadData(code,"",pageIndex,sorts).then(function(res){console.log(res);
$scope.productsList=res.data.products;hideLoading()},function(err){console.log(err)
})}loadData();$scope.hasData=true;$scope.style={one:false,price:false,reviews:false};
var tabs=[{tag:"综合",sort:"relevance"},{tag:"热搜",sort:"topRated"},{tag:"销量",sort:"saleAmount"},{tag:"价格从低到高",sort:"price-asc"},{tag:"价格从高到低",sort:"price-desc"},{tag:"评价从低到高",sort:"reviews-asc"},{tag:"评价从高到低",sort:"reviews-desc"}];
$scope.tabindex=$stateParams.index==""||$stateParams.index==undefined?0:parseInt($stateParams.index);
$scope.changeIndex=function(i){$scope.tabindex=i;sorts=tabs[i].sort};$scope.doRefresh=function(){}
}])});