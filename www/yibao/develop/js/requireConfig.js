require.config({
    enforceDefine: false,
    paths: {
        // 启动时已经加载完成
        'ionic': '/js/lib/ionic.bundle.min',
        // 'ionic': '/js/lib/ionic',
        'yibao': '/js/yibao.min',
        'yibao.common': '/js/yibao.common.min',
        'routes': '/js/routes.min',
        // 基础依赖
        'userService':'/js/service/userService.min',
        // 分组依赖
        'productListService':'/js/service/product/productListService.min'
    },
    shim: {
        'ionic': {
            exports: 'angular'
        },
        'yibao': {
            deps: ['ionic', 'yibao.common', 'routes']
        },
        'yibao.common': {
            deps: ['ionic']
        },
        'routes': {
            deps: ['ionic']
        }
    },
    deps: ['yibao']
});
