/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/crossfire/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(1);
	var Util = __webpack_require__(2);
	var Bullet = __webpack_require__(3);
	var Game = __webpack_require__(4);
	var GameView = __webpack_require__(5);
	
	$(function () {
	  var $canvas = $("canvas");
	
	  $canvas[0].height = $(window).height() * 0.95;
	  $canvas[0].width = $(window).width() * 0.95;
	
	  var game = new Game($canvas);
	  var gameView = new GameView(game, $canvas);
	  gameView.start();
	
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	var defaults = {
	  pos: {x: 75, y: 75},
	  vel: {x: 10, y: 10},
	  radius: 15,
	  color: '#000'
	  };
	
	var MovingObject = function ($canvas, options) {
	  options = $.extend(defaults, options);
	  this.$canvas = $canvas;
	  this.ctx = $canvas[0].getContext("2d");
	  this.pos = options.pos;
	  this.vel = {
	    x: -7,
	    y: 7
	  };
	  this.radius = options.radius;
	  this.color = options.color;
	  this.bounceRecency = 0;
	};
	
	 MovingObject.prototype.draw = function (ctx) {
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
	
	  MovingObject.prototype.move = function () {
	    this.pos.x += this.vel.x;
	    this.pos.y += this.vel.y;
	    this.bounceCheck();
	  };
	
	  MovingObject.prototype.bounceCheck = function () {
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
	
	  MovingObject.prototype.bounce = function (dir) {
	    if (dir === "x") {
	      this.vel.x *= -1;
	    } else if (dir === "y") {
	      this.vel.y *= -1;
	    }
	  };
	
	   MovingObject.prototype.isCollidedWith = function (otherObj) {
	    var xDist = this.pos.x - otherObj.pos.x;
	    var yDist = this.pos.y - otherObj.pos.y;
	    var centerDistance = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));
	
	    if (centerDistance < (this.radius  + otherObj.radius) &&
	          (this.bounceRecency > 10 || otherObj.bounceRecency > 10)) {
	      return true;
	    } else {
	      return false;
	      }
	  };
	
	  MovingObject.prototype.objectBounce = function (otherObj) {
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
	
	   MovingObject.prototype.drawTrail = function (ctx) {
	    var offsetY = this.vel.y; offsetY *= 3;
	    var offsetX = this.vel.x; offsetX *= 3;
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
	
	
	
	module.exports = MovingObject;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Util = function () {
	
	};
	
	Util.inherits = function (childClass, parentClass) {
	  Surrogate = function () {};
	  Surrogate.prototype = parentClass.prototype;
	  childClass.prototype = new Surrogate ();
	};
	
	module.exports = Util;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(1);
	var Util = __webpack_require__(2);
	
	var Bullet = function (side, $canvas) {
	  this.$canvas = $canvas;
	
	  var bullletPos = {y: Math.floor(this.$canvas.height() / 2)};
	
	  if (side === "l") {
	    bullletPos.x = 50;
	  } else if (side === "r") {
	    bullletPos.x = this.$canvas.width() - 50;
	  }
	
	  var defaults = {
	    radius: Bullet.RADIUS,
	    color: Bullet.COLOR,
	    pos: bullletPos
	  };
	
	  MovingObject.call(this, $canvas, defaults);
	};
	
	// bullet class constants
	Bullet.RADIUS = 7;
	Bullet.COLOR = '#000';
	
	Util.inherits(Bullet, MovingObject);
	
	module.exports = Bullet;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Bullet = __webpack_require__(3);
	var Game = function ($canvas) {
	  this.$canvas = $canvas;
	  this.ctx = this.$canvas[0].getContext("2d");
	  this.numBullets = 35;
	  this.bulletArr = [];
	  this.width = $canvas.width();
	  this.height = $canvas.height();
	};
	
	Game.prototype.addBullets = function (numBullets, options) {
	  for (i = 0; i < numBullets; i++) {
	    var side = ["l", "r"][Math.floor(Math.random() * 2)];
	    this.bulletArr.push(new Bullet(side, this.$canvas));
	    this.bulletArr[this.bulletArr.length - 1].vel = {
	      x: Math.floor(Math.random() * 2.5) + 0.5,
	      y: Math.floor(Math.random() * 2.5) + 0.5
	    };
	
	     this.bulletArr[this.bulletArr.length - 1].pos = {
	      x: Math.floor(Math.random() * 500) + 1,
	      y: Math.floor(Math.random() * 500) + 1
	    };
	  }
	};
	
	// render all bullets
	Game.prototype.draw = function () {
	  this.bulletArr.forEach( function (bullet) {
	    bullet.draw(bullet.ctx);
	    // bullet.drawTrail(bullet.ctx);
	  });
	};
	
	// update positions of all bullets
	Game.prototype.move = function () {
	  this.ctx.clearRect(0,0, this.width, this.height);
	  this.bulletArr.forEach( function (bullet) {
	    bullet.move();
	  });
	};
	
	//
	Game.prototype.checkCollisions = function () {
	
	  for (i = 0; i < this.bulletArr.length; i++) {
	      bulletOne = this.bulletArr[i];
	
	    for (j = i + 1; j < this.bulletArr.length; j++) {
	      bulletTwo = this.bulletArr[j];
	
	      if (bulletOne.isCollidedWith(bulletTwo)) {
	        bulletOne.objectBounce(bulletTwo);
	      }
	    }
	    bulletOne.bounceRecency++;
	  }
	};
	
	
	
	
	
	module.exports = Game;


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map