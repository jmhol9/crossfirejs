var Util = function () {

};

Util.inherits = function (childClass, parentClass) {
  Surrogate = function () {};
  Surrogate.prototype = parentClass.prototype;
  childClass.prototype = new Surrogate ();
};

module.exports = Util;
