var MovingObject = require('./moving_object');
var Util = require('./util');
var Bullet = require('./bullet');
var Game = require('./game');
var GameView = require('./game_view');
var Shooter = require('./shooter');
var Target = require('./target');

$(function () {
  // get canvas & set size
  $('body').css("background-color", "#002b36");
  var $canvas = $("canvas");
  var c = $canvas[0].getContext("2d");
  $canvas[0].height = $(window).height() * 0.95;
  $canvas[0].width = $(window).width() * 0.95;

  // create shooter, game, target
  var shooterRight = new Shooter ("right");
  var shooterLeft = new Shooter ("left");

  var targetRight = new Target ($canvas, "right");
  var targetLeft = new Target ($canvas, "left");

  var game = new Game($canvas, shooterRight, shooterLeft, targetRight, targetLeft);
  var gameView = new GameView(game, $canvas, shooterRight, shooterLeft);

  gameView.start();
});


