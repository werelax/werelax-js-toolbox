(function (exports) {

  var ObservableModule = {
    subscribe: function (event, fn) {
      this._listeners[event] || (this._listeners[event] = []);
      this._listeners[event].push(fn);
    },
    unsubscribe: function (event, fn) {
      if (!this._listeners[event]) { return; }
      for (var i=0,_len=this._listeners[event].length; i<_len; i++) {
        if (this._listeners[event][i] == fn) {
          this._listeners[event].splice(i, 1);
          break;
        }
      }
    },
    trigger: function (event) {
      var params = Array.prototype.splice.call(arguments, 1);
      if (this._listeners[event]) {
        for (var i=0,_len=this._listeners[event].length; i<_len; i++) {
          // The context is the controller wich triggered the event
          this._listeners[event][i].apply(this, params);
        }
      }
    }
  }

  ObservableModule.included = function () {
    var org_init = this.prototype.init || function () {};
    this.prototype.init = function () {
      this._listeners = {};
      org_init.apply(this, arguments);
    };
  };
  
  ObservableModule.extended = function () {
    this._listeners = {};
  };

  exports['Observable'] = ObservableModule;

})(this.Wrlx || (this.Wrlx = {}));
