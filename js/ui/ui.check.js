/**
 * Created by huangyl on 2014/11/18.
 */
define(function (require, exports, module) {
    require('ui/basic');;
    (function ($, window) {
        var win = $(window),
            doc = $(document);
        var Check = function () {
            this.init();
        }
        Check.prototype = {
            /**
             * 初始化
             */
            init: function () {
                //初始化checkbox/两种状态切换
                $(".tmb-checkbox").each(function () {
                    $(this).on('click', function () {
                        var input = $(this).children()[0];
                        if ($(input).attr("checked") == true) {
                            if (!$(this).hasClass("checked")) {
                                $(this).addClass("checked");
                            }
                        } else {
                            $(this).removeClass("checked");
                        }
                    });
                });
                $(".tmb-radiobox").each(function (el, index) {
                    $(this).on('click', function () {
                        var input = $(this).children()[0];
                        $(".tmb-radiobox").each(function (el1, index1) {
                            var input = $(this).children()[0];
                            if (index != index1) {
                                $(this).removeClass("checked");
                            }
                        });
                        if ($(input).attr("checked") == true) {
                            if (!$(this).hasClass("checked")) {
                                $(this).addClass("checked");
                            } else {
                                $(this).removeClass("checked");
                            }
                        } else {
                            $(this).removeClass("checked");
                        }
                    });
                });

            }
        }
        var rCheck = function () {
            return new Check();
        }
        window.rCheck = $.rCheck = $.check = rCheck;
    })(window.Zepto, window);
});