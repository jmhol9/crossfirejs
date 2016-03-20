var Bullet = require('./bullet');
var Game = function ($canvas) {
  this.$canvas = $canvas;
  this.ctx = this.$canvas[0].getContext("2d");
  this.numBullets = 35;
  this.bulletArr = [];
  this.width = $canvas.width();
  this.height = $canvas.height();
};

Game.prototype.addBullets = function (numBullets, options) {
  for (i = 0; i < numBullets; i++) {
    var side = ["l", "r"][Math.floor(Math.random() * 2)];
    this.bulletArr.push(new Bullet(side, this.$canvas));
    this.bulletArr[this.bulletArr.length - 1].vel = {
      x: Math.floor(Math.random() * 2.5) + 0.5,
      y: Math.floor(Math.random() * 2.5) + 0.5
    };

     this.bulletArr[this.bulletArr.length - 1].pos = {
      x: Math.floor(Math.random() * 500) + 1,
      y: Math.floor(Math.random() * 500) + 1
    };
  }
};

// render all bullets
Game.prototype.draw = function () {
  this.bulletArr.forEach( function (bullet) {
    bullet.draw(bullet.ctx);
    // bullet.drawTrail(bullet.ctx);
  });
};

// update positions of all bullets
Game.prototype.move = function () {
  this.ctx.clearRect(0,0, this.width, this.height);
  this.bulletArr.forEach( function (bullet) {
    bullet.move();
  });
};

//
Game.prototype.checkCollisions = function () {

  for (i = 0; i < this.bulletArr.length; i++) {
      bulletOne = this.bulletArr[i];

    for (j = i + 1; j < this.bulletArr.length; j++) {
      bulletTwo = this.bulletArr[j];

      if (bulletOne.isCollidedWith(bulletTwo)) {
        bulletOne.objectBounce(bulletTwo);
      }
    }
    bulletOne.bounceRecency++;
  }
};





module.exports = Game;
