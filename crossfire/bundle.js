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


/***/ },
/* 1 */
/***/ function(module, exports) {

	var defaults = {
	  pos: {x: 75, y: 75},
	  vel: {x: 15, y: 15},
	  radius: 15,
	  color: '#000'
	  };
	
	var MovingObject = function ($canvas, options) {
	  options = $.extend(defaults, options);
	  this.$canvas = $canvas;
	  this.ctx = $canvas[0].getContext("2d");
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
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
	    }
	
	    if (this.pos.x - this.radius <= 0) {
	      this.pos.x = this.radius;
	      this.bounce("x");
	    }
	
	    if (this.pos.y + this.radius >= this.$canvas.height()) {
	      this.pos.y = this.$canvas.height() - this.radius;
	      this.bounce("y");
	    }
	
	    if (this.pos.y - this.radius <= 0) {
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map