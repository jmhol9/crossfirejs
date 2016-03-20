var MovingObject = require('./moving_object');
var Util = require('./util');

var Bullet = function (side, $canvas, options) {
  this.$canvas = $canvas;

  var bullletPos = {y: Math.floor(this.$canvas.height() / 2)};

  if (side === "l") {
    bullletPos.x = 50;
  } else if (side === "r") {
    bullletPos.x = this.$canvas.width() - 50;
  }

  var defaults = {
    radius: Bullet.RADIUS,
    color: Bullet.COLOR,
    pos: bullletPos
  };

  options  = options || {};

  MovingObject.call(this, $canvas, $.extend(defaults, options));
};

// bullet class constants
Bullet.RADIUS = 7;
Bullet.COLOR = '#000';

Util.inherits(Bullet, MovingObject);

module.exports = Bullet;
