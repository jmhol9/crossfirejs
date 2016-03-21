var MovingObject = require('./moving_object');
var Util = require('./util');

var Target = function ($canvas, side) {
  this.$canvas = $canvas;
  this.ctx = $canvas[0].getContext("2d");
  this.side = side;
  this.target = true;

  var defaults = {
    radius: 45,
    vel: {x: 0, y: 0}
  };

  if (this.side === "right") {
    this.color = "#268bd2";
    defaults.color = "#268bd2";
    defaults.pos = {
      x: this.$canvas.width() * 0.7,
      y: this.$canvas.height() / 4
    };
  } else if (this.side === "left") {
    this.color = "#dc322f";
    defaults.color = "#dc322f";
    defaults.pos = {
      x: this.$canvas.width() * 0.3,
      y: this.$canvas.height() * 3 / 4
    };
  }


  MovingObject.call(this, $canvas, defaults);
};

Util.inherits(Target, MovingObject);




module.exports = Target;

