var Shooter = function(side) {
    this.side = side;
    this.ammo = 0;
    this.vel = side === "right" ? { x: -3, y: 0 } : { x: 3, y: 0 };
    this.aimAngle = function() {
        var angle = Math.tan(this.vel.y / Math.sqrt(Math.pow(this.vel.x, 2))) * 360 / (2 * Math.PI);
        if (this.side === "right") {
            angle *= -1;
        }

        return angle;
    };
    this.gun = this.side === "right" ? $('.gun-right') : $('.gun-left');

    this.placeGun();
};

Shooter.prototype.fire = function() {
    this.ammo--;
};

Shooter.prototype.reload = function() {
    this.ammo++;
};

// Magnitude of bullet velocity is always 3
// Adjust velocity vectors by incrementing vel.y +/- 0.5
// Then use c^2 - b^2 = a^2 to find new vel.x
Shooter.prototype.aim = function(dir) {
    var aimY = this.vel.y;

    if (dir === "up") {
        aimY -= 0.25;
    } else if (dir === "down") {
        aimY += 0.25;
    }

    if (aimY > 2.1) {
        aimY = 2.1;
    } else if (aimY < -2.1) {
        aimY = -2.1;
    }

    var aimX = Math.sqrt(9 - Math.pow(aimY, 2));

    aimX = this.side === "right" ? aimX * -1 : aimX;

    this.vel = { x: aimX, y: aimY };
};

Shooter.prototype.draw = function() {
    this.gun.css('transform',
        'rotate(' + this.aimAngle() + 'deg)');
};

Shooter.prototype.placeGun = function() {
    this.gun.css('position', 'absolute');
    this.gun.css(this.side, '20px');
    this.gun.css('top', '50%');
    if (this.side === "right") {
        this.gun.css('-webkit-transform', 'scaleX(-1)');
    }
};

module.exports = Shooter;
