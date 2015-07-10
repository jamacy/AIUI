require([
    'ui/ui.pulltorefresh'
],function(){

    var options={
        wrapperDomid:"wrapper",
        pulldwonDomid:"pullDown",
        pullupDomid:"pullUp",
        pullDownLabelText:"下拉刷新",
        pullLoadingText:"加载中...",
        pullUpLabelText:"上拉加载更多",
        pullReleaseRefresh:"已更新了..."
    };
    $.pulltorefresh(options,function(iscroll){
        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
            var el, li, i;
            el = document.getElementById('thelist');
            for (i=0; i<3; i++) {
                li = document.createElement('li');
                li.innerText = 'Generated row1111111111 ';
                el.insertBefore(li, el.childNodes[0]);
            }
            var tipscontent="成功更新了3条数据";
            //暴露Iscroll对象
            var el=$.tips({
                content:tipscontent,
                stayTime:2000,
                type:"success"
            });
            el.on("tips:hide",function(){
                console.log("tips hide");
            });
            iscroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
        }, 1000);
    },function(iscroll){
        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
            var el, li, i;
            el = document.getElementById('thelist');
            for (i=0; i<3; i++) {
                li = document.createElement('li');
                li.innerText = 'Generated rowsadsad ';
                el.appendChild(li, el.childNodes[0]);
            }
            //暴露Iscroll对象
            iscroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
        }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
    });

})


