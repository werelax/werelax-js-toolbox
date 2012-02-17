(function (exports) {

  function find(selector, base) {
    base || (base = document);
    if (typeof $ == 'undefined') {
      var nodelist = base.querySelectorAll(selector);
      return Array.prototype.splice.call(nodelist, 0);
    } else {
      return $(base).find(selector).get();
    }
  }

  function trim(s) {
    return s.replace(/\s+/, '');
  }

  function bind_event(event, el, controller) {
    event = event.split(':');
    var event_name = trim(event[0]);
    var event_handler = trim(event[1]);
    el.addEventListener(event_name, function() {
      var args = Array.prototype.splice.call(arguments, 0);
      args.unshift(this);
      var handler = controller;
      event_handler.split('.').forEach(function (ns) {
        if (handler[ns]) {
          handler = handler[ns];
        } else {
          throw new Error('Events: ' + event_handler + ' doesn\'t exsist');
        }
      });
      if (typeof handler != 'function') {
        throw new Error('Events: ' + event_handler + ' is not a function');
      }
      return handler.apply(controller, args);
    });
  }

  var CaptureEvents = function (controller, selector) {
    var root = (typeof selector == 'string') ? find(selector)[0] : selector;
    if (!root) { throw new Error('Events: ' + selector + ' doesn\'t exist'); }
    var captured_events = {};
    find('[data-event]', root).forEach(function (el) {
      var event_string = el.getAttribute('data-event');
      var events = event_string.split(',');
      events.forEach(function (event) {
        bind_event(event, el, controller);
      });
    });
  };

  exports['Events'] = CaptureEvents;

})(this.Wrlx || (this.Wrlx = {}));
