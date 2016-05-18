(function($) {

    var NAME = 'showflex',
        ELEM = '[data-showflex="container"]';

    function Plugin(elem, options) {
        this.element = elem || ELEM;
        this._name = NAME;
        this._defaults = $.fn[NAME].defaults;
        this.options = $.extend({}, this._defaults, options);

        this.init();
    }

    $.extend(Plugin.prototype, {

        init: function() {
            this.buildCache();
            this.bindEvents();
        },

        destroy: function() {
            // unbind all plugin event handlers
            this.$element.off('.'+this._name);
            // remove values set by `.data()` method on plugin invokation
            this.$element.removeData();

            if (this.options.animate) {
                // remove inline styles applied by jQuery animations
                this.$element.find('[data-showflex="content"]').removeAttr('style');
            }
        },

        buildCache: function() {
            this.$element = $(this.element);
            this.curItem = null;
            this.$items = null;
            this.$contents = null;
        },

        bindEvents: function() {
            this.$element.on('click.'+this._name, '[data-showflex="toggle"]', this.handleToggle.bind(this));
        },

        handleToggle: function(event) {
            this.$curItem  = $(event.target).closest('[data-showflex="item"]');
            this.$items    = this.$curItem.find('[data-showflex="item"]');
            this.$contents = this.$curItem.find('[data-showflex="content"]');

            if (this.$curItem.hasClass(this.options.showClass)) {
                this.closeItem();
            } else {
                this.openItem();
            }
        },

        openItem: function() {
            var self = this;

            if (self.options.animate) {
                self.$contents.first().slideDown(self.options.animateSpeed, function() {
                    self.$curItem.addClass(self.options.showClass);
                    self.callback('afterShow');
                });
            } else {
                self.$curItem.addClass(self.options.showClass);
                self.callback('afterShow');
            }
        },

        closeItem: function() {
            var self = this,
                _content;

            if (self.options.animate) {
                _content = self.$contents.get().reverse();

                $(_content).filter(':visible').each(function(i) {
                    $(this).delay(200 * i).slideUp(self.options.animateSpeed);
                }).promise().done(function() {
                    self.$curItem.removeClass(self.options.showClass);
                    self.$items.removeClass(self.options.showClass);
                    self.callback('afterHide');
                });

            } else {
                self.$curItem.removeClass(self.options.showClass);
                self.$items.removeClass(self.options.showClass);
                self.callback('afterHide');
            }
        },

        callback: function(callback) {
            var _callback = this.options[callback];

            if (typeof _callback === 'function') {
                _callback.call(this.element);
            }
        }

    });

    $.fn[NAME] = function(options) {
        this.each(function() {
            if (!$.data(this, 'plugin_' + NAME)) {
                $.data(this, 'plugin_' + NAME, new Plugin(this, options));
            }
        });
        return this;
    };

    $.fn[NAME].defaults = {
        showClass: 'show',
        animate: true,
        animateSpeed: 200,
        afterShow: null,
        afterHide: null
    };

    $(document).ready(function() {
        $(ELEM)[NAME]();
    });

}(jQuery));
