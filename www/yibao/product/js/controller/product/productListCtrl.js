define(["yibao","productListService"],function(yibao,productListService){yibao.controller("productListCtrl",["$scope","$state","$stateParams","$timeout","$productListService",function($scope,$state,$stateParams,$timeout,$productListService){function showLoading(){$scope.loading=true;
$timeout(function(){$scope.loading=false},10000)}function hideLoading(){$scope.loading=false;
$scope.$broadcast("scroll.refreshComplete");$scope.$broadcast("scroll.infiniteScrollComplete")
}var shopCode="A003";var currentPage=0;var pageSize=20;$scope.hasData=true;$scope.moredata=false;
$scope.style={one:false,price:false,reviews:false};$scope.doRefresh=function(){currentPage=0;
loadData("reload")};function loadData(mode){showLoading();$productListService.loadData(shopCode,currentPage,pageSize).then(function(res){if(mode==="append"){angular.forEach(res.products,function(v,k,o){$scope.products.push(v)
})}else{$scope.products=res.products}hideLoading()},function(err){console.log(err)
})}loadData()}])});