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

  var CaptureElements = function (selector, ctx) {
    var root = (typeof selector == 'string') ? find(selector, ctx)[0] : selector;
    if (!root) { throw new Error('Elements: ' + selector + ' doesn\'t exist'); }
    var captured_elements = {el: root};
    var $ = (typeof jQuery == 'undefined') ? function(x){return x} : jQuery;
    find('[data-el]', root).forEach(function (el) {
      var el_namespace = el.getAttribute('data-el').split('.');
      var el_name = el_namespace.pop();
      var ns = captured_elements;
      el_namespace.forEach(function (name) {
        ns = ns[name] || (ns[name] = {});
      });
      ns[el_name] = $(el);
    });
    return captured_elements;
  };

  exports['Elements'] = CaptureElements;

})(this.Wrlx || (this.Wrlx = {}));
