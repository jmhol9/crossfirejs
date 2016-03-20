var GameView = function (game, $canvas) {
  this.game = game;
  this.$canvas = $canvas;

  this.gameInterval =  function () {
    this.game.move();
    this.game.draw();
    this.game.checkCollisions();
  };

  this.intervalMs = 6;
};

GameView.prototype.start = function () {
  i = 0;
  setInterval(this.gameInterval.bind(this), this.intervalMs);
  this.handleInput();
};

GameView.prototype.handleInput = function () {
  $('body').keydown( function (e) {
  switch (e.which) {
  case 65: // letter "a"
    this.game.addBullets(1);
    break;
  case 76:
    this.game.addBullets(4);
    break;
  case 8:
    this.game.bulletArr = [];
    break;
  default:
    break;
}
  }.bind(this));
};


module.exports = GameView;
