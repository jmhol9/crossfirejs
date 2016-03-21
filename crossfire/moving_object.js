var defaults = {
    pos: { x: 75, y: 75 },
    vel: { x: 10, y: 10 },
    radius: 15,
    color: '#000'
};

var MovingObject = function($canvas, options) {
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

MovingObject.prototype.draw = function(ctx) {
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

MovingObject.prototype.move = function() {
    if (this.target) {
        this.decelerate();
    }
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.bounceCheck();
};

MovingObject.prototype.bounceCheck = function() {
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

MovingObject.prototype.bounce = function(dir) {
    if (dir === "x") {
        this.vel.x *= -1;
    } else if (dir === "y") {
        this.vel.y *= -1;
    }
};

MovingObject.prototype.isCollidedWith = function(otherObj) {
    var xDist = this.pos.x - otherObj.pos.x;
    var yDist = this.pos.y - otherObj.pos.y;
    var centerDistance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

    if (centerDistance < (this.radius + otherObj.radius) &&
        (this.bounceRecency > 10 || otherObj.bounceRecency > 10)) {
        return true;
    } else {
        return false;
    }
};

MovingObject.prototype.objectBounce = function(otherObj) {
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

MovingObject.prototype.targetBulletBounce = function(bullet) {
    //this is a target -- only called when targets and bullets collide

    // adjust target velocity by a small factor
    // base on bullet velocity
    this.vel.x += bullet.vel.x * 0.03;
    this.vel.y += bullet.vel.y * 0.03;

    // bullets are completely elastic
    // quick and dirty solution: calculate difference
    // in position of circle centers to determine if collision
    // is on side or on top -- then reverse bullet's vel.y or vel.x accordingly
    // Reverse bullet velocities if same direction as target
    // Simulates "bouncing off"
    var yDiff = Math.sqrt(Math.pow(this.pos.y - bullet.pos.y, 2));
    if (yDiff < .80 * this.radius) {
        bullet.vel.x *= -1;
    } else {
        bullet.vel.y *= -1;
    }

    // attempt to remove bullet from inside of circle
    var i = 0;
    while (this.isCollidedWith(bullet) && i < 10) {
        bullet.move();
        i++;
    }
};

MovingObject.prototype.drawTrail = function(ctx) {
    var offsetY = this.vel.y;
    offsetY *= 3;
    var offsetX = this.vel.x;
    offsetX *= 3;
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

MovingObject.prototype.decelerate = function() {
    this.vel.x *= 0.9965;
    this.vel.y *= 0.9965;
};



module.exports = MovingObject;
