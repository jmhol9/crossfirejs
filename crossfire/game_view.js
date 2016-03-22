var GameView = function(game, $canvas, shooterRight, shooterLeft) {
    this.game = game;
    this.$canvas = $canvas;
    this.shooterRight = shooterRight;
    this.shooterLeft = shooterLeft;

    this.gameInterval = function() {
        this.game.move();
        this.game.draw();
        this.game.checkCollisions();
    };

    this.aimInterval = function(shooter, dir) {
        shooter.aim(dir);
    };

    this.intervalMs = 8;
};

GameView.prototype.start = function() {
    i = 0;
    setInterval(this.gameInterval.bind(this), this.intervalMs);
    this.handleInput();
};

GameView.prototype.handleInput = function() {
    var rightAim = function(dir) {
        setInterval(this.shooterRight.aim(dir), 15);
    }.bind(this);
    var leftAim = function(dir) {
        setInterval(this.shooterLeft.aim(dir), 15);
    }.bind(this);

    $('body').keydown(function(e) {
        switch (e.which) {
            case 88: // letter "x"
                // function () {
                this.game.addBullets(
                    1, {
                        color: '#dc322f',
                        pos: { x: 50, y: this.$canvas.height() / 2 },
                        vel: {
                            x: this.shooterLeft.vel.x,
                            y: this.shooterLeft.vel.y
                        }
                    });
                //  }
                break;
            case 190: // period key
                this.game.addBullets(
                    1, {
                        color: '#268bd2',
                        pos: { x: this.$canvas.width() - 50, y: this.$canvas.height() / 2 },
                        vel: {
                            x: this.shooterRight.vel.x,
                            y: this.shooterRight.vel.y
                        }
                    });
                break;
            case 222: // apostrophe
                this.shooterRight.aimUp = true;
                break;
            case 191: // the "/" key
                this.shooterRight.aimDown = true;
                break;
            case 65: // letter "a"
                this.shooterLeft.aimUp = true;
                break;
            case 90: // letter "z"
                this.shooterLeft.aimDown = true;
                break;
            case 48:
                this.game.bulletArr = [];
                break;
            default:
                break;
        }
    }.bind(this));

    $('body').keyup(function(e) {
        switch (e.which) {
            case 222: // apostrophe
                this.shooterRight.aimUp = false;
                break;
            case 191: // the "/" key
                this.shooterRight.aimDown = false;
                break;
            case 65: // letter "a"
                this.shooterLeft.aimUp = false;
                break;
            case 90: // letter "z"
                this.shooterLeft.aimDown = false;
                break;
            default:
                break;
        }
    }.bind(this));

};


module.exports = GameView;
