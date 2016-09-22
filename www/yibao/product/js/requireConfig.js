require.config({
    enforceDefine: false,
    paths: {
        // 'ionic': '/js/lib/ionic.bundle.min',
        'ionic': '/js/lib/ionic.bundle',
        'yibao': '/js/yibao',
        'routes': '/js/routes'
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
