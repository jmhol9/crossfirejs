var Bullet = require('./bullet');
var Game = function($canvas, shooterRight, shooterLeft, targetRight, targetLeft) {
    this.$canvas = $canvas;
    this.ctx = this.$canvas[0].getContext("2d");

    this.numBullets = 35
    this.bulletArr = [];

    // Indicates percent of Y-axis exits blocked by
    // buffers. Eg, with two 25% buffers, 50% of each
    // exit will be blocked.
    this.bufferHeight = 0.25;

    this.width = $canvas.width();
    this.height = $canvas.height();

    this.shooterRight = shooterRight;
    this.shooterLeft = shooterLeft;
    this.shooterRight.draw();
    this.shooterLeft.draw();

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
};

// Draw vertical grid in background of canvas
Game.prototype.drawGrid = function(ctx) {
    var spacing = 25;
    var i;
    for (i = 0; i < Math.ceil(this.$canvas.width() / spacing); i++) {
        var x = spacing * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.$canvas.height());
        ctx.strokeStyle = '#b58900';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
};

// render all bullets
Game.prototype.draw = function() {
    this.drawGrid(this.ctx);
    this.drawBuffers();
    this.bulletArr.forEach(function(bullet) {
        bullet.draw(bullet.ctx);
    });

    this.updateShooters();

    this.targetRight.draw(this.targetRight.ctx);
    this.targetLeft.draw(this.targetLeft.ctx);
};

// update positions of all bullets
Game.prototype.move = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.bulletArr.forEach(function(bullet, idx) {
        bullet.move();
        bullet.bounceCheck(this.bufferHeight);
        if (bullet.outOfBounds === true) {
            this.bulletArr.splice(idx, 1);
        }
    }.bind(this));
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

Game.prototype.updateShooters = function () {
    [this.shooterRight, this.shooterLeft].forEach (function (shooter) {
        if (shooter.aimUp === true) {
            shooter.aim("up");
        } else if (shooter.aimDown === true) {
            shooter.aim("down");
        }
    });
};

Game.prototype.drawBuffers = function () {
    this.ctx.fillStyle = '#b58900';
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, this.$canvas.height() * this.bufferHeight);
    this.ctx.lineTo(this.$canvas.width() / 2, 0);
    this.ctx.fill();

    this.ctx.moveTo(0, this.$canvas.height());
    this.ctx.lineTo(0, this.$canvas.height() - this.bufferHeight * this.$canvas.height());
    this.ctx.lineTo(this.$canvas.width() / 2, this.$canvas.height());
    this.ctx.fill();

    this.ctx.moveTo(this.$canvas.width(), this.$canvas.height());
    this.ctx.lineTo(this.$canvas.width(), this.$canvas.height() - this.bufferHeight * this.$canvas.height());
    this.ctx.lineTo(this.$canvas.width() / 2, this.$canvas.height());
    this.ctx.fill();

    this.ctx.moveTo(this.$canvas.width(), 0);
    this.ctx.lineTo(this.$canvas.width(), this.bufferHeight * this.$canvas.height());
    this.ctx.lineTo(this.$canvas.width() / 2, 0);
    this.ctx.fill();
};

module.exports = Game;
