(function() {
    // actual code...
    var NOOP = function () {};
    var levels = {
      'all': true
    , 'debug': true
    , 'info': true
    , 'warn': true
    , 'error': true
    , 'silent': true
    , 'quiet': true
    };

    // fix IE9s dodgy console.log...
    // http://whattheheadsaid.com/2011/04/internet-explorer-9s-problematic-console-object
    if (Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === "object") {
      ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach(function (method) {
        console[method] = this.call(console[method], console);
      }, Function.prototype.bind);
    }


    function bindConsole(methodName) {
      if (typeof console !== 'undefined' && console[methodName] && console[methodName].bind) {
        return console[methodName].bind(console);
      } else if (!Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === "object") {
        // IE8 -> https://twitter.com/kangax/status/56059642433900544
        return function () { Function.prototype.call.call(console[methodName], console, Array.prototype.slice.call(arguments)); };
      } else {
        return NOOP;
      }
    }


    // returns flog. Can be used as flog or as an instance
    var flog = {
      level: 'quiet',
      log: NOOP,
      info: NOOP,
      warn: NOOP,
      error: NOOP,

      create: function (level) {
        function F() {}
        F.prototype = this;
        var f = new F();
        f.setLevel(level);
        return f;
      },

      setLevel: function (level) {
        if (level in levels) {
          if (level === 'all') this.level = 'debug';
          else if (level === 'silent') this.level = 'quiet';
          else this.level = level;
        }
        else this.level = 'quiet';

        // reset all log methods to silent
        this.log = this.info = this.warn = this.error = NOOP;

        switch (this.level) {
          case 'all':
          case 'debug':
            this.log = bindConsole('log');
            /* falls through */
          case 'info':
            this.info = bindConsole('info');
            /* falls through */
          case 'warn':
            this.warn = bindConsole('warn');
            /* falls through */
          case 'error':
            this.error = bindConsole('error');
            break;
        }

        return this;
      }
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
      module.exports = flog;
    } else if (typeof define === 'function' && define.amd) {
      define(flog);
    }
    if (typeof window !== undefined && typeof window.flog === 'undefined') {
      window.flog = flog;
    }
}());
