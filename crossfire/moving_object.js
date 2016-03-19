var defaults = {
  pos: {x: 75, y: 75},
  vel: {x: 15, y: 15},
  radius: 15,
  color: '#000'
  };

var MovingObject = function ($canvas, options) {
  options = $.extend(defaults, options);
  this.$canvas = $canvas;
  this.ctx = $canvas[0].getContext("2d");
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
};

 MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos.x,
      this.pos.y,
      this.radius,
      0, // startAngle
      2 * Math.PI
    );
    ctx.fill();
  };

  MovingObject.prototype.move = function () {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.bounceCheck();
  };

  MovingObject.prototype.bounceCheck = function () {
    if (this.pos.x + this.radius >= this.$canvas.width()) {
      this.pos.x = this.$canvas.width() - this.radius;
      // this.vel.x *= -1;
      this.bounce("x");
    }

    if (this.pos.x - this.radius <= 0) {
      this.pos.x = this.radius;
      this.bounce("x");
    }

    if (this.pos.y + this.radius >= this.$canvas.height()) {
      this.pos.y = this.$canvas.height() - this.radius;
      this.bounce("y");
    }

    if (this.pos.y - this.radius <= 0) {
      this.pos.y = this.radius;
      this.bounce("y");
    }
  };

  MovingObject.prototype.bounce = function (dir) {
    if (dir === "x") {
      this.vel.x *= -1;
    } else if (dir === "y") {
      this.vel.y *= -1;
    }
  };

module.exports = MovingObject;
