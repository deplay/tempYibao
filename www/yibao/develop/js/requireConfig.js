require.config({
    enforceDefine: false,
    paths: {
        // 启动时已经加载完成
        'ionic': '/js/lib/ionic.bundle.min',
        'lazyImg': '/js/lib/lazyImg',
        // 'ionic': '/js/lib/ionic',
        'yibao': '/js/yibao',
        'yibao.common': '/js/yibao.common',
        'routes': '/js/routes',
        // 基础依赖
        'userService': '/js/service/userService',
        // 分组依赖
        'productListService': '/js/service/product/productListService'
    },
    shim: {
        'ionic': {
            exports: 'angular'
        },
        'yibao': {
            deps: ['ionic', 'yibao.common', 'routes','lazyImg']
        },
        'lazyImg': {
            deps: ['ionic']
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
