var Bullet = require('./bullet');
var Game = function($canvas, shooterRight, shooterLeft, targetRight, targetLeft) {
    this.$canvas = $canvas;
    this.ctx = this.$canvas[0].getContext("2d");

    this.numBullets = 35;
    this.bulletArr = [];

    this.width = $canvas.width();
    this.height = $canvas.height();

    this.shooterRight = shooterRight;
    this.shooterLeft = shooterLeft;
    this.targetRight = targetRight;
    this.targetLeft = targetLeft;


    this.bulletArr.push(this.targetLeft);
    this.bulletArr.push(this.targetRight);
};

Game.prototype.addBullets = function(numBullets, options) {
    for (i = 0; i < numBullets; i++) {
        var side = ["l", "r"][Math.floor(Math.random() * 2)];
        this.bulletArr.push(new Bullet(side, this.$canvas, options));
    }


    // this.bulletArr[this.bulletArr.length - 1].vel = {
    //   x: Math.random() * 5,
    //   y: Math.random() *5
    // };
};

Game.prototype.drawGrid = function(ctx) {
    var spacing = 25;
    var i;
    for (i = 0; i < Math.ceil(this.$canvas.width() / spacing); i++) {
        var x = spacing * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.$canvas.height());
        ctx.strokeStyle = '#586e75';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    // for (i = 0; i < Math.ceil(this.$canvas.height() / spacing); i++) {
    //   var y = spacing * i;
    //   ctx.moveTo(0, y);
    //   ctx.lineTo(this.$canvas.width(), y);
    //   ctx.strokeStyle = '#EEEEEE';
    //   ctx.lineWidth = 1;
    //   ctx.stroke();
    // }
};

// render all bullets
Game.prototype.draw = function() {
    this.drawGrid(this.ctx);
    this.bulletArr.forEach(function(bullet) {
        bullet.draw(bullet.ctx);
    });

    this.shooterRight.draw();
    this.shooterLeft.draw();


    this.targetRight.draw(this.targetRight.ctx);
    this.targetLeft.draw(this.targetLeft.ctx);
};

// update positions of all bullets
Game.prototype.move = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.bulletArr.forEach(function(bullet) {
        bullet.move();
    });
};

// Targets are first two objs in this.bulletArr
// So bullets should never be "i" iterator when
//  target is "j" iterator
Game.prototype.checkCollisions = function() {

    for (i = 0; i < this.bulletArr.length; i++) {
        bulletOne = this.bulletArr[i];

        for (j = i + 1; j < this.bulletArr.length; j++) {
            bulletTwo = this.bulletArr[j];

            if (bulletOne.isCollidedWith(bulletTwo)) {
                if (bulletOne.target && !bulletTwo.target) {
                    bulletOne.targetBulletBounce(bulletTwo);
                } else {
                    bulletOne.objectBounce(bulletTwo);
                }
            }
        }

        bulletOne.bounceRecency++;
    }
};





module.exports = Game;
