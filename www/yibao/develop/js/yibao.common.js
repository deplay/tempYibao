// 存放共用的constant service directive filter等
var yibaoCommon = angular.module('yibaoCommon', []);


// 常数
yibaoCommon.constant('DEBUG', false)
    .constant('SERVER', {
        url: 'https://www1.hxyxt.com',
        testUrl: 'https://stage.hxyxt.com'
    })
    .constant('URLMAP', {
        login: '/yxtws/oauth/token',
        productList: '/yxtws/v1/hxyxt/category/yxdj/'
    })
    // 服务
yibaoCommon.service('$getUrl', ['DEBUG', 'SERVER', 'URLMAP', function(DEBUG, SERVER, URLMAP) {
    return function(key) {
        var url = URLMAP[key];
        if (!url) {
            console.log('找不到对应的url地址');
            return
        }
        if (url.indexOf('http://')) return url;
        return DEBUG ? SERVER.testUrl + url : SERVER.url + url;
    };
}]);
