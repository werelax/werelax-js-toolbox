(function (exports) {

  function LousyTemp(text) {
    var code = '%>' + text + '<%';
    code = code
    .replace(/[\n\r\t]/g,' ')
    .replace(/(["'])/g, '\\$1')
    .replace(/<%=(.*?)%>/g, "', $1, '")
    .replace(/%>(.*?)<%/g, "_t_.push('$1'); ");
    code = "var _t_ = []; with(obj) {" + code + "}; return _t_.join('');";
    return new Function('obj', code);
  }

  LousyTemp.by_id = function (id) {
    var el = document.getElementById(id);
    if (el) {
      return LousyTemp(el.innerHTML);
    } else {
      throw new Error("LousyTemplate: Not element found with id '" + id + "'");
    }
  };

  exports['Template'] = LousyTemp;

})(this.Wrlx || (this.Wrlx = {}));
