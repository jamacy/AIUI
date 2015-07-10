
define(function (require, exports, module) {
    require('ui/basic');;
    (function ($, window) {
        var win = $(window),
            doc = $(document);
        var Collapse = function () {
            this.init();
        }
        Collapse.prototype = {
            init: function () {
                $(".tmb-collapse li").each(function () {
                    $(this).on("click", function () {
                        if ($(this).data("switch") == "off") {
                            $(this).data("switch", "on");
                            $(this).find("a").first().removeClass("icon-collapse-down");
                            $(this).find("a").first().addClass("icon-collapse-up");
                            $(this).find(".tmb-collapse-panel").show();
                        } else {
                            $(this).data("switch", "off");
                            $(this).find("a").first().removeClass("icon-collapse-up");
                            $(this).find("a").first().addClass("icon-collapse-down");
                            $(this).find(".tmb-collapse-panel").hide();
                        }
                    });
                });
            }
        }
        var rCollapse = function () {
            return new Collapse();
        }
        window.Collapse = $.rCollapse = $.collapse = rCollapse;
    })(window.Zepto, window);
});