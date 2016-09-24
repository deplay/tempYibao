var lazyImg=angular.module("lazyImg",[]);lazyImg.factory("debounce",["$timeout",function($timeout){function debounce(fn,debounceTime){var timeout;
function _debounce(){$timeout.cancel(timeout);timeout=$timeout(fn,debounceTime)}return _debounce
}return debounce}]);lazyImg.factory("DPQ",[function(){var DPQ=(function(){var dualPivotQS={};
dualPivotQS.sort=function(arr,property,fromIndex,toIndex){if(fromIndex===undefined&&toIndex===undefined){this.sort(arr,property,0,arr.length)
}else{rangeCheck(arr.length,fromIndex,toIndex);dualPivotQuicksort(arr,fromIndex,toIndex-1,3,property)
}return arr};function rangeCheck(length,fromIndex,toIndex){if(fromIndex>toIndex){console.error("fromIndex("+fromIndex+") > toIndex("+toIndex+")")
}if(fromIndex<0){console.error(fromIndex)}if(toIndex>length){console.error(toIndex)
}}function swap(arr,i,j){var temp=arr[i];arr[i]=arr[j];arr[j]=temp}function dualPivotQuicksort(arr,left,right,div,property){var len=right-left;
if(len<27){for(var i=left+1;i<=right;i++){for(var j=i;j>left&&arr[j][property]<arr[j-1][property];
j--){swap(arr,j,j-1)}}return}var third=Math.floor(len/div);var m1=left+third;var m2=right-third;
if(m1<=left){m1=left+1}if(m2>=right){m2=right-1}if(arr[m1][property]<arr[m2][property]){swap(arr,m1,left);
swap(arr,m2,right)}else{swap(arr,m1,right);swap(arr,m2,left)}var pivot1=arr[left][property];
var pivot2=arr[right][property];var less=left+1;var great=right-1;for(var k=less;
k<=great;k++){if(arr[k][property]<pivot1){swap(arr,k,less++)}else{if(arr[k][property]>pivot2){while(k<great&&arr[great][property]>pivot2){great--
}swap(arr,k,great--);if(arr[k][property]<pivot1){swap(arr,k,less++)}}}}var dist=great-less;
if(dist<13){div++}swap(arr,less-1,left);swap(arr,great+1,right);dualPivotQuicksort(arr,left,less-2,div,property);
dualPivotQuicksort(arr,great+2,right,div,property);if(dist>len-13&&pivot1!==pivot2){for(var k=less;
k<=great;k++){if(arr[k][property]===pivot1){swap(arr,k,less++)}else{if(arr[k][property]===pivot2){swap(arr,k,great--);
if(arr[k][property]===pivot1){swap(arr,k,less++)}}}}}if(pivot1<pivot2){dualPivotQuicksort(arr,less,great,div,property)
}}return dualPivotQS}());return DPQ}]);lazyImg.directive("lazyImgContainer",function(){return{restrict:"A",controller:["$element",function($element){$element.data("lazyImgContainer",$element)
}]}});lazyImg.service("containerSize",[function(){this.height=function(target){var ele=target[0]||target;
if(!ele){return}if(ele.tagName==="ION-CONTENT"){ele=ele.childNodes[0]}return ele.innerHeight||ele.clientHeight||(document.documentElement&&document.documentElement.clientHeight)||(document.body&&document.body.clientHeight)||window.innerHeight||null
};this.width=function(target){var ele=target[0]||target;if(!ele){return}if(ele.tagName==="ION-CONTENT"){ele=ele.childNodes[0]
}return ele.innerWidth||ele.clientWidth||(document.documentElement&&document.documentElement.clientWidth)||(document.body&&document.body.clientWidth)||window.innerWidth||null
};this.scrollTop=function(target){var ele=target[0]||target;if(!ele){return}if(ele.tagName==="ION-CONTENT"){var divScroll=ele.childNodes[0];
var transformValue=divScroll.style.transform;var transformRegExp=/^translate3d\((-?[\d.]+)px, (-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)$/;
if(transformRegExp.test(transformValue)){var match=transformValue.match(transformRegExp);
return -match[2]}else{return ele.scrollTop||null}}return ele.pageYOffset||ele.scrollTop||(document.documentElement&&document.documentElement.scrollTop)||(document.body&&document.body.scrollTop)||window.pageYOffset||null
};this.scrollBottom=function(target){var ele=target[0]||target;return this.scrollTop(target)+ele.clientHeight
};this.scrollLeft=function(target){var ele=target[0]||target;if(!ele){return}if(ele.tagName==="ION-CONTENT"){var divScroll=ele.childNodes[0];
var transformValue=divScroll.style.transform;var transformRegExp=/^translate3d\((-?[\d.]+)px, (-?[\d.]+)px, (-?[\d.]+)px\) scale\(([\d.]+)\)$/;
if(transformRegExp.test(transformValue)){var match=transformValue.match(transformRegExp);
return -match[1]}else{return ele.scrollLeft||null}}return ele.pageXOffset||ele.scrollLeft||(document.documentElement&&document.documentElement.scrollLeft)||(document.body&&document.body.scrollLeft)||window.pageXOffset||null
};this.scrollRight=function(target){var ele=target[0]||target;return this.scrollLeft(target)+ele.clientWidth
};this.offsetTop=function(eleWrap,conWrap){var ele=eleWrap[0]||eleWrap;var con=conWrap[0]||conWrap;
var offsetTop=0;while(ele.offsetParent){offsetTop+=ele.offsetTop;if(ele.offsetParent===con){return offsetTop
}ele=ele.offsetParent}return null};this.offsetLeft=function(eleWrap,conWrap){var ele=eleWrap[0]||eleWrap;
var con=conWrap[0]||conWrap;var offsetLeft=0;while(ele.offsetParent){offsetLeft+=ele.offsetLeft;
if(ele.offsetParent===con){return offsetLeft}ele=ele.offsetParent}return null}}]);
lazyImg.factory("eventToggle",["$window",function($window){function _eventToggle(jqWrap,toggle,fn){if(!jqWrap||!(toggle in {on:true,off:true})||!angular.isFunction(fn)){return
}if(toggle==="on"){angular.element(document).ready(fn)}angular.element($window)[toggle]("resize",fn);
angular.element($window)[toggle]("scroll",fn);if(jqWrap[0]!==$window){jqWrap[toggle]("resize",fn);
jqWrap[toggle]("scroll",fn)}}return _eventToggle}]);lazyImg.factory("dPR",["$window",function($window){function _dPR(){return $window.devicePixelRatio||1
}return _dPR}]);lazyImg.provider("lazyImgConfig",[function(){this.thresh=250;this.supportDevicePixelRatio=true;
this.$get=function(){return this}}]);lazyImg.directive("lazyImg",["$q","$window","$rootScope","debounce","DPQ","containerSize","eventToggle","loadImg","lazyImgConfig",function($q,$window,$rootScope,debounce,DPQ,containerSize,eventToggle,loadImg,lazyImgConfig){return{restrict:"E",compile:function(tElement,tAttrs){return link;
function link(scope,element,attrs){var watcher;var thresh=parseInt(attrs.thresh);
if(isNaN(thresh)){thresh=lazyImgConfig.thresh}var $container=element.inheritedData("lazyImgContainer")||angular.element($window);
function _responseMain(){var scrollBottom=containerSize.scrollBottom($container);
loop("off");DPQ.sort(watcher,"offsetTop");loop();function loop(mode){var i=0,l=watcher.length,counter=0;
for(;i<l;i++){if(mode==="off"){if(watcher[i].visited===true){counter++}}else{if(scrollBottom<watcher[i].offsetTop){return
}else{if(watcher[i].visited!==true){loadImg(watcher[i].element,watcher[i].attrs);
watcher[i].visited=true}}}}if(counter===l){eventToggle($container,"off",_response)
}}}var _response=debounce(_responseMain,300);function _init($container){(watcher=$container.data("dataArr",watcher))||($container.data("dataArr",watcher=[]));
var dataBox={get offsetTop(){return containerSize.offsetTop(element,$container)-thresh
},element:element,attrs:attrs};watcher.push(dataBox)}_init($container);eventToggle($container,"on",_response);
scope.$on("lazyImg.destroyed",_response);scope.$on("$destroy",function(){$rootScope.$broadcast("lazyImg.destroyed");
eventToggle($container,"off",_response)})}}}}]);lazyImg.factory("loadImg",["$q","$timeout","lazyImgConfig",function($q,$timeout,lazyImgConfig){function _loadImg(element,attrs){var newImage=new Image();
var newImageWrapper=angular.element(newImage);newImageWrapper.attr("style",attrs.style);
newImageWrapper.attr("class",attrs["class"]);$timeout(function(){var src=attrs.lazySrc;
src+="!"+Math.ceil(window.screen.width*1.6*0.5)+"x"+70+".jpg";newImage.src=src;newImage.onload=function(){element.replaceWith(newImage)
}})}return _loadImg}]);