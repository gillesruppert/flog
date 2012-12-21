(function(def){
  def('flog', [], function() {

    // actual code...
    var EMPTY = function () {};
    var levels = {
      'all': true
    , 'info': true
    , 'warn': true
    , 'error': true
    , 'silent': true
    , 'quiet': true
    };

    function bindConsole(methodName) {
      if (console && console[methodName] && console[methodName].bind) {
        return console[methodName].bind(console);
      } else {
        return EMPTY;
      }
    }

    // deal with IE8 & IE9's weird console.log (typeof == 'object')...
    // http://whattheheadsaid.com/2011/04/internet-explorer-9s-problematic-console-object
    if (Function.prototype.bind && console && typeof console.log === "object") {
      var logMethods = ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd", "trace"];

      try {
        // IE9
        logMethods.forEach(function (method) {
          console[method] = this.call(console[method], console);
        }, Function.prototype.bind);
      } catch(e) {
        // IE8
        function fixIe8(method) {
          console[method] = Function.prototype.call.bind(console[method], console);
        }
        for (var i = 0; i < logMethods.length; i++) {
          fixIe8(logMethods[i]);
        }
      }
    }

    // returns flog. Can be used as flog or as an instance
    return {
      level: 'quiet',
      log: EMPTY,
      info: EMPTY,
      warn: EMPTY,
      error: EMPTY,

      create: function () {
        function F() {}
        F.prototype = this;
        return new F();
      },

      setLevel: function (level) {
        if (level in levels) {
          if (level === 'all') this.level = 'info';
          else if (level === 'silent') this.level = 'quiet';
          else this.level = level;
        }
        else this.level = 'quiet';

        switch (this.level) {
          case 'info':
          case 'all':
            this.log = bindConsole('log');
            this.info = bindConsole('info');
            /* falls through */
          case 'warn':
            this.warn = bindConsole('warn');
            /* falls through */
          case 'error':
            this.error = bindConsole('error');
            break;
          default:
            this.log = this.info = this.warn = this.error = EMPTY;
        }

        return this;
      }
    };

  });
}(
  // wrapper to run code everywhere
  (function () {
    var def;

    // AMD
    if (typeof define === 'function' && define.amd) {
      def = function (name, deps, factory) {
        define(deps, factory);
      };
    // CJS/node.js
    } else if (typeof require === 'function' && typeof module !== 'undefined' && module.exports) {
       def = function (deps, factory) {
          module.exports = factory.apply(this, deps.map(require));
       };
    // script
    } else {
      def = function (name, deps, factory) {
        var d, i = 0, global = this, old = global[name], mod;
        while ((d = deps[i])) {
          deps[i++] = this[d];
        }
        global[name] = mod = factory.apply(global, deps);
        mod.noConflict = function(){
          global[name] = old;
          return mod;
        };
      };
    }
    return def;
  }())
));
