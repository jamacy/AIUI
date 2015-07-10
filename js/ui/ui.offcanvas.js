define(function (require, exports, module) {
    require('vendor/zepto/zepto');
    require('ui/zepto.mension');
    require('ui/zepto.extend.data');
    require('ui/core');

    var $ = window.Zepto,
        UI = $.TMBUI,
        $win = $(window),
        $doc = $(document),
        scrollPos;

    var OffCanvas = function (element, options) {
        this.$element = $(element);
        this.options = options;
        this.events();
    };

    OffCanvas.DEFAULTS = {
        effect: 'overlay'
    };
    OffCanvas.prototype.open = function (relatedElement) {
        var _self = this,
            $element = this.$element,
            openEvent = $.Event('open:offcanvas:tmbui');

        if (!$element.length || $element.hasClass('tmb-active')) return;

        var effect = this.options.effect,
            $html = $('html'),
            $bar = $element.find('.tmb-offcanvas-bar').first(),
            dir = $bar.hasClass('tmb-offcanvas-bar-flip') ? -1 : 1;

        $bar.addClass('tmb-offcanvas-bar-' + effect);

        scrollPos = {
            x: window.scrollX,
            y: window.scrollY
        };

        $element.addClass('tmb-active');

        $html.css({
            'width': '100%',
            'height': $win.height()
        }).addClass('tmb-offcanvas-page');

        if (!(effect === 'overlay')) {
            $html.css({
                'margin-left': $bar.outerWidth() * dir
            }).width(); // .width() - force redraw
        }

        $html.css('margin-top', scrollPos.y * -1);

        UI.utils.debounce(function () {
            $bar.addClass('tmb-offcanvas-bar-active').width();
        }, 0)();

        $doc.trigger(openEvent);

        $element.off('.offcanvas.tmbui').on('click.offcanvas.tmbui swipeRight.offcanvas.tmbui swipeLeft.offcanvas.tmbui', function (e) {
            var $target = $(e.target);

            if (!e.type.match(/swipe/)) {
                if ($target.hasClass('tmb-offcanvas-bar')) return;
                if ($target.parents('.tmb-offcanvas-bar').first().length) return;
            }

            e.stopImmediatePropagation();

            _self.close();
        });

        $doc.on('keydown.offcanvas.tmbui', function (e) {
            if (e.keyCode === 27) { // ESC
                _self.close();
            }
        });
    };

    OffCanvas.prototype.close = function (relatedElement) {
        var $html = $('html'),
            $element = this.$element,
            $bar = $element.find('.tmb-offcanvas-bar').first();

        if (!$element.length || !$element.hasClass('tmb-active')) return;

        $element.trigger('close:offcanvas:tmbui');

        if (UI.support.transition) {
            $html.one(UI.support.transition.end, function () {
                $html.removeClass('tmb-offcanvas-page').css({
                    'width': '',
                    'height': '',
                    'margin-top': ''
                });
                $element.removeClass('tmb-active');
                window.scrollTo(scrollPos.x, scrollPos.y);
            }).css('margin-left', '');

            UI.utils.debounce(function () {
                $bar.removeClass('tmb-offcanvas-bar-active');
            }, 0)();
        } else {
            $html.removeClass('tmb-offcanvas-page').attr('style', '');
            $element.removeClass('tmb-active');
            $bar.removeClass('tmb-offcanvas-bar-active');
            window.scrollTo(scrollPos.x, scrollPos.y);
        }

        $element.off('.offcanvas.tmbui');
    };

    OffCanvas.prototype.events = function () {
        $doc.on('click.offcanvas.tmbui', '[data-tmb-dismiss="offcanvas"]',
            $.proxy(function (e) {
                e.preventDefault();
                this.close();
            }, this));

        return this;
    };

    UI.offcanvas = OffCanvas;

    function Plugin(option, relatedElement) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('tmb.offcanvas'),
                options = $.extend({}, OffCanvas.DEFAULTS, typeof option == 'object' && option);

            if (!data) {
                $this.data('tmb.offcanvas', (data = new OffCanvas(this, options)));
                data.open(relatedElement);
            }

            if (typeof option == 'string') {
                data[option] && data[option](relatedElement);
            }
        });
    }

    $.fn.offCanvas = Plugin;

    $doc.on('click.offcanvas.tmbui', '[data-tmb-offcanvas]', function (e) {
        e.preventDefault();
        var $this = $(this),
            options = UI.utils.parseOptions($this.attr('data-tmb-offcanvas')),
            $target = $(options.target || (this.href && this.href.replace(/.*(?=#[^\s]+$)/, '')));
        option = $target.data('tmb.offcanvas') ? 'open' : options;

        Plugin.call($target, option, this);
    });

    module.exports = OffCanvas;
});