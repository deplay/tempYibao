require.config({enforceDefine:false,paths:{ionic:"/js/lib/ionic.bundle.min",lazyImg:"/js/lib/lazyImg",yibao:"/js/yibao","yibao.common":"/js/yibao.common",routes:"/js/routes",userService:"/js/service/userService",productListService:"/js/service/product/productListService"},shim:{ionic:{exports:"angular"},yibao:{deps:["ionic","yibao.common","routes","lazyImg"]},lazyImg:{deps:["ionic"]},"yibao.common":{deps:["ionic"]},routes:{deps:["ionic"]}},deps:["yibao"]});