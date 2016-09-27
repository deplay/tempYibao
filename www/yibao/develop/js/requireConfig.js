require.config({
    enforceDefine: false,
    paths: {
        // 启动时已经加载完成
        'ionic': '/js/lib/ionic.bundle.min', // 'ionic': '/js/lib/ionic',
        'lazyImg': '/js/lib/lazyImg',
        'localforage': '/js/lib/localforage.min',
        'angularLocalForage': '/js/lib/angularLocalForage.min',
        'photoswipe': '/js/lib/photoswipe.min',
        'photoswipeUI': '/js/lib/photoswipe-ui-default.min',
        'angularPhotoswipe': '/js/lib/angular-photoswipe',
        'toaster': '/js/lib/toaster.min',
        'yibao': '/js/yibao',
        'yibao.common': '/js/yibao.common',
        'routes': '/js/routes',
        // 分组依赖
        'productService': '/js/service/product/productService',
        'productListService': '/js/service/product/productListService',
        'confirmOrderService': '/js/service/order/confirmOrderService',    // 确认订单
        'forgetPasswordService': '/js/service/user/forgetPasswordService',   // 忘记密码
        'shoppingCartService': '/js/service/cart/shoppingCartService'    // 购物车
    },
    shim: {
        'ionic': {
            exports: 'angular'
        },
        'yibao': {
            deps: ['ionic', 'toaster', 'yibao.common', 'routes', 'lazyImg', 'angularLocalForage', 'angularPhotoswipe']
        },
        'angularLocalForage': {
            deps: ['ionic', 'localforage']
        },
        'photoswipeUI': {
            deps: ['photoswipe']
        },
        'angularPhotoswipe': {
            deps: ['ionic', 'photoswipeUI']
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
