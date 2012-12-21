(function(def){
  def('flog', [], function() {

    // actual code...
    return {
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
