(function(def){
  def('flog', [], function() {


    // actual code...
    var EMPTY = function () {};
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
        return EMPTY;
      }
    }


    // returns flog. Can be used as flog or as an instance
    return {
      level: 'quiet',
      log: EMPTY,
      info: EMPTY,
      warn: EMPTY,
      error: EMPTY,

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
        this.log = this.info = this.warn = this.error = EMPTY;

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
