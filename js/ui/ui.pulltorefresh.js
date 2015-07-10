/**
 * Created by huangyl on 2014/11/18.
 */
define(function (require, exports, module) {
    require('ui/basic');
    require('vendor/iscroll/iscroll');;
    (function ($, window) {
        var win = $(window),
            doc = $(document);

        var PullRefresh = function (options, pullDownAction, pullUpAction) {
            this.settings = $.extend({}, PullRefresh.defaults, options);
            this.IScroll = null;
            this.init(pullDownAction, pullUpAction);
        }
        PullRefresh.prototype = {
            init: function (pullDownAction, pullUpAction) {
                var _this = this;
                var myScroll,
                    pullDownEl, pullDownOffset,
                    pullUpEl, pullUpOffset,
                    generatedCount = 0;
                pullDownEl = document.getElementById(_this.settings.pulldwonDomid);
                pullDownEl && (pullDownOffset = pullDownEl.offsetHeight);
                pullUpEl = document.getElementById(_this.settings.pullupDomid);
                pullUpEl && (pullUpOffset = pullUpEl.offsetHeight);
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);


                myScroll = new iScroll(_this.settings.wrapperDomid, {
                    useTransition: true,
                    topOffset: pullDownOffset,
                    onRefresh: function () {
                        if (pullDownEl.className.match('loading')) {
                            pullDownEl.className = '';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = _this.settings.pullDownLabelText;
                        } else if (pullUpEl.className.match('loading')) {
                            pullUpEl.className = '';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = _this.settings.pullUpLabelText;
                        }
                    },
                    onScrollMove: function () {
                        if (this.y > 5 && !pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'flip';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = _this.settings.pullReleaseRefresh;
                            this.minScrollY = 0;
                        } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                            pullDownEl.className = '';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = _this.settings.pullDownLabelText;
                            this.minScrollY = -pullDownOffset;
                        } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'flip';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = _this.settings.pullReleaseRefresh;
                            this.maxScrollY = this.maxScrollY;
                        } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                            pullUpEl.className = '';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = _this.settings.pullUpLabelText;
                            this.maxScrollY = pullUpOffset;
                        }
                    },
                    onScrollEnd: function () {
                        if (pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'loading';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = _this.settings.pullLoadingText;
                            pullDownAction(this); // Execute custom function (ajax call?)
                        } else if (pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'loading';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = _this.settings.pullLoadingText;
                            pullUpAction(this); // Execute custom function (ajax call?)
                        }
                    }
                });

                setTimeout(function () {
                    document.getElementById('wrapper').style.left = '0';
                }, 800);
                var innerHeight = window.innerHeight - 95;
                $("#wrapper").height(innerHeight);
                myScroll.refresh();
            }


        }
        PullRefresh.defaults = {
            wrapperDomid: "wrapper",
            pulldwonDomid: "pullDown",
            pullupDomid: "pullUp",
            pullDownLabelText: "下拉刷新",
            pullLoadingText: "加载中...",
            pullUpLabelText: "上拉加载更多",
            pullReleaseRefresh: "已更新..."
        }
        var rPullRefresh = function (options, pullDownAction, pullUpAction) {
            return new PullRefresh(options, pullDownAction, pullUpAction);
        }
        window.rPullRefresh = $.rPullRefresh = $.pullrefresh = $.pulltorefresh = rPullRefresh;
    })(window.Zepto, window);
});