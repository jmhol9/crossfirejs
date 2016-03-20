var MovingObject = require('./moving_object');
var Util = require('./util');
var Bullet = require('./bullet');
var Game = require('./game');
var GameView = require('./game_view');

$(function () {
  var $canvas = $("canvas");

  $canvas[0].height = $(window).height() * 0.95;
  $canvas[0].width = $(window).width() * 0.95;

  var game = new Game($canvas);
  var gameView = new GameView(game, $canvas);
  gameView.start();

});
