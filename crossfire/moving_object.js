var defaults = {
  pos: {x: 75, y: 75},
  vel: {x: 10, y: 10},
  radius: 15,
  color: '#000'
  };

var MovingObject = function ($canvas, options) {
  options = $.extend(defaults, options);
  this.$canvas = $canvas;
  this.ctx = $canvas[0].getContext("2d");
  this.pos = options.pos;
  this.vel = options.vel;
  // Apply slight vel adjustment to make aim imperfect
  this.vel.y += Math.random() * 0.28 - 0.14;
  this.vel.x += Math.random() * 0.28 - 0.14;
  this.radius = options.radius;
  this.color = options.color;
  this.bounceRecency = 0;
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
    if (this.target) {
      this.decelerate();
    }
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.bounceCheck();
  };

  MovingObject.prototype.bounceCheck = function () {
    if (this.pos.x + this.radius >= this.$canvas.width()) {
      this.pos.x = this.$canvas.width() - this.radius;
      // this.vel.x *= -1;
      this.bounce("x");
    } else if (this.pos.x - this.radius <= 0) {
      this.pos.x = this.radius;
      this.bounce("x");
    }

    if (this.pos.y + this.radius >= this.$canvas.height()) {
      this.pos.y = this.$canvas.height() - this.radius;
      this.bounce("y");
    } else if (this.pos.y - this.radius <= 0) {
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

   MovingObject.prototype.isCollidedWith = function (otherObj) {
    var xDist = this.pos.x - otherObj.pos.x;
    var yDist = this.pos.y - otherObj.pos.y;
    var centerDistance = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));

    if (centerDistance < (this.radius  + otherObj.radius) &&
          (this.bounceRecency > 10 || otherObj.bounceRecency > 10)) {
      return true;
    } else {
      return false;
      }
  };

  MovingObject.prototype.objectBounce = function (otherObj) {
    this.bounceRecency = 0;
    otherObj.bounceRecency = 0;
    // check if x velocities have opposite direction
    if (this.vel.x * this.vel.x < 0) {
          this.bounce("x");
          otherObj.bounce("x");
      } else {
        var swapX = this.vel.x;
        this.vel.x = otherObj.vel.x;
        otherObj.vel.x = swapX;
      }

    // check if y velocities have opposite direction
    if (otherObj.vel.y * this.vel.y < 0) {
      this.bounce("y");
      otherObj.bounce("y");
    } else {
      var swapY = this.vel.y;
      this.vel.y = otherObj.vel.y;
      otherObj.vel.y = swapY;
    }
  };

  MovingObject.prototype.targetBulletBounce = function (bullet) {
    //this is a target -- only called when targets and bullets collide
    // bullet velocities alter target velocities by 20%
    if (Math.sqrt(Math.pow(bullet.vel.x, 2)) < 0.075) {
      bullet.vel.x *= 2;
    }

    if (Math.sqrt(Math.pow(bullet.vel.y, 2)) < 0.075) {
      bullet.vel.y *= 2;
    }

    // Target hit slows down bullet if they're going
    // same direction
    // Speeds up and reverses bullet if opposite
    if (this.vel.x * bullet.vel.x > 0) {
      bullet.vel.x *= 0.55;
      this.vel.x += bullet.vel.x * 0.025;
    } else {
      bullet.vel.x *= -1;
      this.vel.x -= bullet.vel.x * 0.005;
    }

    if (this.vel.y * bullet.vel.y > 0) {
      bullet.vel.y *= 0.25;
      this.vel.y += bullet.vel.y * 0.025;
    } else {
      bullet.vel.y *= -1;
      this.vel.y -= bullet.vel.y * 0.005;
    }
  };

   MovingObject.prototype.drawTrail = function (ctx) {
    var offsetY = this.vel.y; offsetY *= 3;
    var offsetX = this.vel.x; offsetX *= 3;
    var trailColors = ['#aaa', '#888', '#333'];

    for (i = 0; i <= 2; i++) {
      ctx.fillStyle = trailColors[i];
      ctx.beginPath();
      ctx.arc(
        this.pos.x - offsetX * 15,
        this.pos.y - offsetY * 15,
        Math.floor(this.radius / (3.5 - i)),
        0, // startAngle
        2 * Math.PI
      );
      ctx.fill();

      offsetY = offsetY * 0.5;
      offsetX = offsetX * 0.5;
    }
  };

  MovingObject.prototype.decelerate = function () {
    this.vel.x *= .99;
    this.vel.y *= .99;
  };



module.exports = MovingObject;
