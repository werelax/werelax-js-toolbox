(function (exports) {

  var reserved_keywords = { 'extend':null, 'include':null };

  function Module() {
    if (typeof this.init === 'function') {
      this.init.apply(this, arguments);
    }
  }
  Module.include = function (obj) {
    if (!obj) { throw new Error('include(obj) requires obj'); }
    for (var key in obj) if (obj.hasOwnProperty(key) && !(key in reserved_keywords)) {
      this.prototype[key] = obj[key];
    }
    if (typeof obj.included === 'function') {
      obj.included.apply(this);
    }
  };
  Module.extend = function (obj) {
    if (!obj) { throw new Error('extend(obj) requires obj'); }
    for (var key in obj) if (obj.hasOwnProperty(key) && !(key in reserved_keywords)) {
      this[key] = obj[key];
    }
    if (typeof obj.extended === 'function') {
      obj.extended.apply(this);
    }
  };
  Module.proxy = function (fn) {
    var ctx = this
    return function() {
      fn.apply(ctx, arguments);
    }
  };
  Module.create = function (instances, statics) {
    var _super_ = this;
    var F = function () {};
    F.prototype = this.prototype;
    var child = function () { _super_.apply(this, arguments); };
    child.prototype = new F();
    child.prototype._super_ = _super_;
    child.prototype.super = function(name) {
        var args = Array.prototype.splice.call(arguments, 1);
        var superfn = _super_.prototype[name];
        if (typeof superfn === 'function') {
            return superfn.apply(this, args);
        }
    };

    for (var key in this) if (this.hasOwnProperty(key)) {
        child[key] = this[key];
    }
    if (instances) {
        child.include(instances);
    }
    if (statics) {
        child.extend(statics);
    }
    return child;
  };
  Module.prototype = {
    proxy: function (fn) {
      var ctx = this;
      return function() {
        fn.apply(ctx, arguments);
      };
    }
  };

  exports['Class'] = Module;

})(this.Wrlx || (this.Wrlx = {}));
