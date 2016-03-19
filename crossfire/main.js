var MovingObject = require('./moving_object');
var Util = require('./util');

$(function () {
  var $canvas = $("canvas");

  $canvas[0].height = $(window).height() * 0.95;
  $canvas[0].width = $(window).width() * 0.95;

  var testObj = new MovingObject($canvas);

  var testMove = function () {
    var ctx = $canvas[0].getContext("2d");
    ctx.clearRect(0, 0, $(window).width() * 0.95, $(window).height() * 0.95);
    testObj.draw(ctx);
    testObj.move();
  };

  setInterval(testMove, 15);

});
