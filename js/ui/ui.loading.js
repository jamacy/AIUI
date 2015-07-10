/**
 * Created by huangyl on 2014/11/25.
 */
define(function (require, exports, module) {
    require('ui/basic');
    require('ui/ui.canvasloader');;
    (function ($) {
        // 默认模板
        var _loadingTpl = '<div class="tmb-dialog tmb-dialog-notice show">' +
            '<div class="tmb-dialog-cnt">' +
            '<i class="tmb-loading-bright" id="cl_roundRect">' +
            '</i>' +
            '<p><%=content%></p>' +
            '</div>' +
            '</div>';
        // 默认参数
        var defaults = {
            content: '加载中...',
            type: "spiral",
            color: "#fff"
        }
        // 构造函数
        var Loading = function (el, option, isFromTpl) {
            var self = this;
            this.element = $(el);
            this._isFromTpl = isFromTpl;
            this.option = $.extend(defaults, option);
            var cl = new CanvasLoader('cl_roundRect');
            cl.setColor('#f2e9f2'); // default is '#000000'
            cl.setShape('spiral'); // default is 'oval'
            cl.setDiameter(40); // default is 40
            cl.setDensity(40); // default is 40
            cl.show(); // Hidden by default
            this.show();
        }
        Loading.prototype = {
            show: function () {
                var e = $.Event('loading:show');
                this.element.trigger(e);
                this.element.show();

            },
            hide: function () {
                var e = $.Event('loading:hide');
                this.element.trigger(e);
                this.element.remove();
            }
        }
        function Plugin(option) {
            return $.adaptObject(this, defaults, option, _loadingTpl, Loading, "loading");
        }
        $.fn.loading = $.loading = Plugin;
    })(window.Zepto);
});