require.config({
    enforceDefine: false,
    paths: {
        'ionic': '/js/lib/ionic.bundle.min',
        // 'ionic': '/js/lib/ionic.debug',
        'yibao': '/js/yibao.min',
        'routes': '/js/routes.min'
    },
    shim: {
        'ionic': {
            exports: 'angular'
        },
        'yibao': {
            deps: ['ionic','routes']
        },
        'routes': {
            deps: ['ionic']
        }
    },
    deps: ['yibao']
});
