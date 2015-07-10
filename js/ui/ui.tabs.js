/**
 * Created by huangyl on 2014/11/21.
 */
define(function (require, exports, module) {
    require('ui/basic');;
    (function ($) {
        // 默认参数
        var defaults = {
            speedline: 300,
            speedbox: 500
        }
        var Tab = function (el, onstyle, type, option) {
            this.option = $.extend(defaults, option);
            this.init(el, onstyle, type);
        }
        Tab.prototype = {
            init: function (el, onstyle, type) {
                if (type == undefined || type == null || type == "" || type == 0) {
                    this.defalutTab(el, onstyle);
                } else if (type == 1) {
                    this.verticalTab(el, onstyle);
                }
            },
            defalutTab: function (el, onstyle) {
                var _this = this;
                var len = 0;
                var f = 0;
                var cq = 0;
                var tablength = 100 / $(el + ' .tmb-nav-top li').length;
                $(el + ' .tmb-nav-top li').each(function () {
                    $(this).width(tablength + "%")
                });
                $(el + ' .tmb-line').width(tablength + "%");
                $(el + ' .tmb-nav-top li').click(function () {
                    var t = $(this).index();
                    var wh = $(el + ' .tmb-line').width();
                    f = -25 * t + "%";
                    cq = 100 * t + "%";
                    $(this).parents(el).find('.tmb-nav-mid').css({
                        '-webkit-transform': 'translate(' + f + ')',
                        '-webkit-transition': +_this.option.speedbox + 'ms linear'
                    });
                    $(this).parents(el).find('.tmb-line').css({
                        '-webkit-transform': 'translate(' + cq + ')',
                        '-webkit-transition': +_this.option.speedline + 'ms linear'
                    });
                    $(this).siblings().removeClass(onstyle);
                    $(this).addClass(onstyle);
                });
            },
            verticalTab: function (el, onstyle) {
                var box = $(el + ' .tmb-tab-content').find('div');
                box.eq(0).show();
                $(el).on('click', '.tmb-tab-cell li', function (e) {
                    var index = $(e.currentTarget).index(),
                        that = $(this);
                    !that.hasClass("tmb-tab-current") && (function () {
                        $(el).find('.tmb-tab-cell li').removeClass('tmb-tab-current');
                        that.addClass("tmb-tab-current");
                        box.hide();
                        box.eq(index).show();
                    })();
                })
            }
        }

        function Plugin(el, onstyle, type, option) {
            return new Tab(el, onstyle, type, option);
        }
        $.fn.tab = $.tab = Plugin;
    })(window.Zepto);
});