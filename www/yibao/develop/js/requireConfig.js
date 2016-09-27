require.config({
    enforceDefine: false,
    paths: {
        // 启动时已经加载完成
        'ionic': '/js/lib/ionic.bundle.min', // 'ionic': '/js/lib/ionic',
        'lazyImg': '/js/lib/lazyImg',
        'localforage': '/js/lib/localforage.min',
        'angularLocalForage': '/js/lib/angularLocalForage.min',
        'toaster': '/js/lib/toaster.min',
        'yibao': '/js/yibao',
        'yibao.common': '/js/yibao.common',
        'routes': '/js/routes',
        // 分组依赖
        'productListService': '/js/service/product/productListService',
        // 确认订单
        'confirmOrderService': '/js/service/order/confirmOrderService',
        // 忘记密码
        'forgetPasswordService': '/js/service/user/forgetPasswordService'
    },
    shim: {
        'ionic': {
            exports: 'angular'
        },
        'yibao': {
            deps: ['ionic', 'toaster', 'yibao.common', 'routes', 'lazyImg', 'angularLocalForage']
        },
        'angularLocalForage': {
            deps: ['ionic', 'localforage']
        },
        'toaster': {
            deps: ['ionic']
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
