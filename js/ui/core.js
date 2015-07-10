define(function (require, exports, module) {
    require('vendor/zepto/zepto');
    require('ui/zepto.event');
    // Zepto animate extend
    require('ui/zepto.extend.fx');

    // Zepto data extend
    require('ui/zepto.extend.data');

    // Zepto selector extend
    require('ui/zepto.extend.selector');

    var $ = window.Zepto,
        UI = $.TMBUI || {},
        $win = $(window),
        doc = window.document,
        $html = $('html');

    if (UI.fn) {
        return UI;
    }

    UI.fn = function (command, options) {
        var args = arguments,
            cmd = command.match(/^([a-z\-]+)(?:\.([a-z]+))?/i),
            component = cmd[1],
            method = cmd[2];

        if (!UI[component]) {
            return this;
        }

        return this.each(function () {
            var $this = $(this),
                data = $this.data(component);
            if (!data) $this.data(component, (data = UI[component](this, method ? undefined : options)));
            if (method) data[method].apply(data, Array.prototype.slice.call(args, 1));
        });
    };

    UI.support = {};
    UI.support.transition = (function () {

        var transitionEnd = (function () {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                },
                name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        })();

        return transitionEnd && {
            end: transitionEnd
        };

    })();

    UI.support.animation = (function () {

        var animationEnd = (function () {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd oanimationend',
                    animation: 'animationend'
                },
                name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        })();

        return animationEnd && {
            end: animationEnd
        };
    })();

    UI.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

    UI.support.touch = (
        ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) || (window.DocumentTouch && document instanceof window.DocumentTouch) || (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
        (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
        false);

    // https://developer.mozilla.org/zh-CN/docs/DOM/MutationObserver
    UI.support.mutationobserver = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null);

    UI.utils = {};

    UI.utils.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    UI.utils.isInView = function (element, options) {

        var $element = $(element);

        var visible = !!($element.width() || $element.height()) && $element.css("display") !== "none";

        if (!visible) {
            return false;
        }

        var window_left = $win.scrollLeft(),
            window_top = $win.scrollTop(),
            offset = $element.offset(),
            left = offset.left,
            top = offset.top;

        options = $.extend({
            topOffset: 0,
            leftOffset: 0
        }, options);

        return (top + $element.height() >= window_top && top - options.topOffset <= window_top + $win.height() && left + $element.width() >= window_left && left - options.leftOffset <= window_left + $win.width());
    };

    UI.utils.parseOptions = UI.utils.options = function (string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1),
            options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {}
        }

        return options;
    };

    UI.utils.event = {};
    UI.utils.event.click = UI.support.touch ? 'tap' : 'click';

    $.TMBUI = UI;
    $.fn.tmbui = UI.fn;

    $.TMBUI.langdirection = $('html').attr('dir') == 'rtl' ? 'right' : 'left';

    $.fn.emulateTransitionEnd = function (duration) {
        var called = false,
            $el = this;
        $(this).one(UI.support.transition.end, function () {
            called = true
        });
        var callback = function () {
            if (!called) {
                $($el).trigger(UI.support.transition.end);
            }
        };
        setTimeout(callback, duration);
        return this;
    };

    $.fn.redraw = function () {
        $(this).each(function () {
            var redraw = this.offsetHeight;
        });
        return this;
    };

    $.fn.transitionEnd = function (callback) {
        var endEvent = UI.support.transition.end,
            dom = this;

        function fireCallBack(e) {
            callback.call(this, e);
            endEvent && dom.off(endEvent, fireCallBack);
        }

        if (callback && endEvent) {
            dom.on(endEvent, fireCallBack);
        }
        return this;
    };

    $.fn.removeClassRegEx = function () {
        return this.each(function (regex) {
            var classes = $(this).attr('class');

            if (!classes || !regex) return false;

            var classArray = [];
            classes = classes.split(' ');

            for (var i = 0, len = classes.length; i < len; i++)
                if (!classes[i].match(regex)) classArray.push(classes[i]);

            $(this).attr('class', classArray.join(' '));
        });
    };

    //
    $.fn.alterClass = function (removals, additions) {
        var self = this;

        if (removals.indexOf('*') === -1) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass(removals);
            return !additions ? self : self.addClass(additions);
        }

        var classPattern = new RegExp('\\s' + removals.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') + '\\s', 'g');

        self.each(function (i, it) {
            var cn = ' ' + it.className + ' ';
            while (classPattern.test(cn)) {
                cn = cn.replace(classPattern, ' ');
            }
            it.className = $.trim(cn);
        });

        return !additions ? self : self.addClass(additions);
    };

    $.fn.getHeight = function () {
        var $ele = $(this),
            height = 'auto';

        if ($ele.is(':visible')) {
            height = $ele.height();
        } else {
            var tmp = {
                position: $ele.css('position'),
                visibility: $ele.css('visibility'),
                display: $ele.css('display')
            };

            height = $ele.css({
                position: 'absolute',
                visibility: 'hidden',
                display: 'block'
            }).height();

            $ele.css(tmp); // reset element
        }
        return height;
    };

    $.fn.getSize = function () {
        var $el = $(this);
        if ($el.css('display') !== 'none') {
            return {
                width: $el.width(),
                height: $el.height()
            };
        }

        var old = {
                position: $el.css('position'),
                visibility: $el.css('visibility'),
                display: $el.css('display')
            },
            tmpStyle = {
                display: 'block',
                position: 'absolute',
                visibility: 'hidden'
            };

        $el.css(tmpStyle);
        var width = $el.width(),
            height = $el.height();

        $el.css(old);
        return {
            width: width,
            height: height
        };

    };

    var _is = $.fn.is,
        _filter = $.fn.filter;

    function visible(elem) {
        elem = $(elem);
        return !!(elem.width() || elem.height()) && elem.css("display") !== "none";
    }

    $.fn.is = function (sel) {
        if (sel === ':visible') {
            return visible(this);
        }
        if (sel === ':hidden') {
            return !visible(this);
        }
        return _is.call(this, sel);
    };

    $.fn.filter = function (sel) {
        if (sel === ':visible') {
            return $([].filter.call(this, visible));
        }
        if (sel === ':hidden') {
            return $([].filter.call(this, function (elem) {
                return !visible(elem);
            }));
        }
        return _filter.call(this, sel);
    };

    UI.utils.rAF = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || //window.oRequestAnimationFrame ||
            // if all else fails, use setTimeout
            function (callback) {
                return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
            };
    })();

    UI.utils.cancelAF = (function () {
        return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || //window.oCancelAnimationFrame ||
            function (id) {
                window.clearTimeout(id);
            };
    })();

    if (UI.support.touch) {
        require(['ui/util.fastclick'], function (FastClick) {
            $(function () {
                FastClick && FastClick.attach(document.body);
                $html.addClass('tmb-touch');
            });
        });
    }

    $(function () {
        // trigger domready event
        $(document).trigger('domready:tmbui');

        $html.removeClass('no-js').addClass('js');

        UI.support.animation && $html.addClass('cssanimations');

        // Remove responsive classes in .am-layout
        var $layout = $('.tmb-layout');
        $layout.find('[class*="md-block-grid"]').alterClass('md-block-grid-*');
        $layout.find('[class*="lg-block-grid"]').alterClass('lg-block-grid');

        // widgets not in .am-layout
        $('[data-tmb-widget]').each(function () {
            var $widget = $(this);
            // console.log($widget.parents('.am-layout').length)
            if ($widget.parents('.tmb-layout').length === 0) {
                $widget.addClass('tmb-no-layout');
            }
        });
    });

    module.exports = UI;
});