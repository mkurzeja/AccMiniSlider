(function ($) {
    var methods = {
        init:function (options) {

            var settings = $.extend({
                classInner       :'accMiniSliderInner',
                classContainer   :'accMiniSliderContainer',
                classElement     :'accMiniSliderImage',
                classControl     :'accMiniSliderControl',
                classControlLeft :'accMiniSliderLeftControl',
                classControlRight:'accMiniSliderRightControl',
                autoPlay         :null,
                autoPlayTime     :5000,
                loop             :false
            }, options);
            var $this = $(this);
            var elements = $this.children();
            var inner = $('<div class="accMiniSliderInner"></div>');
            var data = $this.data('accMiniSlider');
            var count = elements.length;
            var currentPos = 0;

            inner.appendTo($this);
            elements.appendTo(inner);
            $this.addClass('accMiniSliderContainer');
            elements.addClass('accMiniSliderImage');

            if (settings.loop) {
                elements.first().clone().appendTo(inner);
            }


            var width = $(this).width();

            if (!data) {
                var prev, next;

                prev = $('<span class="accMiniSliderControl accMiniSliderLeftControl">Prev</span>');
                next = $('<span class="accMiniSliderControl accMiniSliderRightControl">Next</span>');

                var controls = $();

                controls.add(prev).add(next).bind('click.accMiniSlider', methods.click);

                inner.parent().prepend(prev);
                inner.parent().append(next);
                inner.width(width * count);

                if (settings.loop) {
                    inner.width(inner.width() + width);
                }

                $this.data('accMiniSlider', {
                    elements  :elements,
                    inner     :inner,
                    width     :width,
                    count     :count,
                    options   :settings,
                    next      :next,
                    prev      :prev,
                    currentPos:currentPos
                });
            }

            if(settings.autoPlay)
            {
                //setTimeout(methods.autoPlay , settings.autoPlayTime);
                //methods.autoPlay.apply(this)
                setTimeout(function(){ methods.autoPlay.apply($this);}, settings.autoPlayTime);
            }

            methods.update.apply($this);

            return $this;
        },

        update:function () {
            $this = $(this);
            var data = $this.data('accMiniSlider');

            if (!data.options.loop && data.currentPos == 0) {
                data.prev.hide();
            }
            else {
                data.prev.show();
            }

            if (!data.options.loop && (data.currentPos == data.count - 1)) {
                data.next.hide();
            }
            else {
                data.next.show();
            }

            return $this;
        },

        click:function () {
            $this = $(this).parent();
            var data = $this.data('accMiniSlider');

            data.options.autoPlay = false;
            data.currentPos = ($(this).hasClass('accMiniSliderRightControl')) ? data.currentPos + 1 : data.currentPos - 1;
            return methods.animate.apply($this);
        },

        destroy:function () {
            var $this = $(this);
            this.remove();
            return $this;
        },

        next:function () {
            if($this == null)
            {
                $this = $(this);
            }

            var data = $this.data('accMiniSlider');
            data.currentPos++;
            return methods.animate.apply($this);
        },

        prev:function () {
            if($this == null)
            {
                $this = $(this);
            }

            var data = $this.data('accMiniSlider');
            data.currentPos--;
            return methods.animate.apply($this);
        },

        animate:function () {
            $this = $(this);
            var data = $this.data('accMiniSlider');

            if (!data.options.loop) {
                if (data.currentPos < 0) data.currentPos = 0;
                if (data.currentPos >= data.count) data.currentPos = data.count - 1;
            }
            else {
                if (data.currentPos < 0) {
                    data.currentPos = data.count;
                    methods.jump.apply($this);
                    data.currentPos--;
                }
                if (data.currentPos > data.count) {
                    data.currentPos = 0;
                    methods.jump.apply($this);
                    data.currentPos++;
                }
            }


            $(data.inner).animate({
                'marginLeft':data.width * (-data.currentPos)
            });

            methods.update.apply(this);
            return $this;
        },

        jump:function () {
            $this = $(this);
            var data = $this.data('accMiniSlider');
            $(data.inner).css('marginLeft', data.width * (-data.currentPos));
        },

        autoPlay:function () {
            $this = $(this);
            var data = $this.data('accMiniSlider');

            if (data.options.autoPlay && (data.options.loop || data.currentPos < data.count)) {
                methods.next.apply(this);
                var _this = this;
                setTimeout(function(){ methods.autoPlay.apply(_this);}, data.options.autoPlayTime);
            }
        }
    };

    $.fn.accMiniSlider = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.accMiniSlider');
        }
    }
})(jQuery);