var GameView = function (game, $canvas, shooterRight, shooterLeft) {
  this.game = game;
  this.$canvas = $canvas;
  this.shooterRight = shooterRight;
  this.shooterLeft = shooterLeft;

  this.gameInterval =  function () {
    this.game.move();
    this.game.draw();
    this.game.checkCollisions();
  };

  this.aimInterval = function (shooter, dir) {
    shooter.aim(dir);
  };

  this.intervalMs = 8;
};

GameView.prototype.start = function () {
  i = 0;
  setInterval(this.gameInterval.bind(this), this.intervalMs);
  this.handleInput();
};

GameView.prototype.handleInput = function () {
  var rightAim = function (dir) {
    setInterval(this.shooterRight.aim(dir), 15);
    }.bind(this);
  var leftAim = function (dir) {
    setInterval(this.shooterLeft.aim(dir), 15);
    }.bind(this);

  $('body').keydown( function (e) {
    switch (e.which) {
    case 88: // letter "x"
     // function () {
      this.game.addBullets(
          1,
          { color: '#dc322f',
            pos: {x: 50, y: this.$canvas.height() / 2},
            vel: {
              x: this.shooterLeft.vel.x,
              y: this.shooterLeft.vel.y
            }
          });
    //  }
      break;
    case 190: // period key
      this.game.addBullets(
        1,
        { color: '#268bd2',
          pos: {x: this.$canvas.width() - 50, y: this.$canvas.height() / 2},
          vel: {
            x: this.shooterRight.vel.x,
            y: this.shooterRight.vel.y
          }
        });
      break;
    case 222: // apostrophe
      rightAim("up");
      break;
    case 191: // the "/" key
      rightAim("down");
      break;
    case 65: // letter "a"
      leftAim("up");
      break;
    case 90: // letter "z"
      leftAim("down");
      break;
    case 8:
      this.game.bulletArr = [];
      break;
    default:
      break;
    }
  }.bind(this));

  $('body').keyup( function (e) {
    switch (e.which) {
    case 222: // apostrophe
      clearInterval(rightAim);
      break;
    case 191: // the "/" key
      clearInterval(rightAim);
      break;
    case 65: // apostrophe
      clearInterval(leftAim);
      break;
    case 90: // the "/" key
      clearInterval(leftAim);
      break;
    default:
      break;
    }
  }.bind(this));

};


module.exports = GameView;
