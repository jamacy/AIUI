
define(function (require, exports, module) {
    require('ui/basic');;
    (function ($, window) {
        var win = $(window),
            doc = $(document);
        var Select = function () {
            this.init();
        }
        Select.prototype = {
            /**
             * 初始化
             */
            init: function () {
                $(".tmb-select").each(function () {
                    $(this).on("click", function () {
                        if ($(this).data("switch") == "off") {
                            $(this).data("switch", "on");
                            //alert( $(this).find("a").addClass());
                            $(this).find("a").removeClass("icon-chevron-down-right");
                            $(this).find("a").addClass("icon-chevron-up-right");
                            $(this).next().show(100);
                        } else {
                            $(this).data("switch", "off");
                            $(this).find("a").removeClass("icon-chevron-up-right");
                            $(this).find("a").addClass("icon-chevron-down-right");
                            $(this).next().hide();
                        }
                    });
                });
            }
        }
        var rSelect = function () {
            return new Select();
        }
        window.rSelect = $.rSelect = $.select = rSelect;
    })(window.Zepto, window);
});