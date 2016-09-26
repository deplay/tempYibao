require.config({
    enforceDefine: false,
    paths: {
        // 启动时已经加载完成
        'ionic': '/js/lib/ionic.bundle.min', // 'ionic': '/js/lib/ionic',
        'lazyImg': '/js/lib/lazyImg',
        'localforage': '/js/lib/localforage.min',
        'angularLocalForage': '/js/lib/angularLocalForage.min',
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
            deps: ['ionic', 'yibao.common', 'routes', 'lazyImg', 'angularLocalForage']
        },
        'angularLocalForage': {
            deps: ['ionic', 'localforage']
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
