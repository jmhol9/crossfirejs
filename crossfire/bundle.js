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
	var Shooter = __webpack_require__(6);
	var Target = __webpack_require__(7);
	
	$(function() {
	    // get canvas & set size
	    $('body').css("background-color", "#002b36");
	    var $canvas = $("canvas");
	    var c = $canvas[0].getContext("2d");
	    $canvas[0].height = $(window).height() * 0.95;
	    $canvas[0].width = $(window).width() * 0.95;
	
	    // // create shooter, game, target
	    var shooterRight = new Shooter("right");
	    var shooterLeft = new Shooter("left");
	
	    var targetRight = new Target($canvas, "right");
	    var targetLeft = new Target($canvas, "left");
	
	    var game = new Game($canvas, shooterRight, shooterLeft, targetRight, targetLeft);
	    var gameView = new GameView(game, $canvas, shooterRight, shooterLeft);
	
	    gameView.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	    this.vel.y += Math.random() * 0.40 - 0.20;
	    this.vel.x += Math.random() * 0.40 - 0.20;
	    this.radius = options.radius;
	    this.color = options.color;
	    //increments on each bounce check; must clear
	    //some number to allow another bounce
	    this.bounceRecency = 0;
	    //outOfBounds set to true when off canvas; cleared
	    // from game.bulletArr on next bounceCheck iteration
	    this.outOfBounds = false;
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
	};
	
	MovingObject.prototype.bounceCheck = function(bufferSize) {
	    // if position invalid on X-axis, object is out of bounds
	    // will be removed from game.bulletArr after bounce.check
	    if (this.pos.x - this.radius >= this.$canvas.width()) {
	        this.outOfBounds = true;
	    } else if (this.pos.x + this.radius <= 0) {
	        this.outOfBounds = true;
	    }
	
	    // for y axis bounces, calculate buffer height at bullet.pos.x
	    // See if bullet pos.y is low/high enough to trigger bounce
	    var halfCtxWidth = this.$canvas.width() / 2;
	    var ctxHeight = this.$canvas.height();
	    var bufferHeight = (Math.abs(this.pos.x - halfCtxWidth) / halfCtxWidth) * (bufferSize * ctxHeight);
	
	    // if position invalid on Y axis, trigger Y-axis bounce
	    if (this.pos.y + this.radius >= ctxHeight - bufferHeight) {
	        this.pos.y = this.$canvas.height() - this.radius  - bufferHeight;
	        this.bounce("y");
	    } else if (this.pos.y - this.radius <= bufferHeight) {
	        this.pos.y = this.radius + bufferHeight;
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
	
	var Bullet = function(side, $canvas, options) {
	    this.$canvas = $canvas;
	
	    var bullletPos = { y: Math.floor(this.$canvas.height() / 2) };
	
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
	
	    options = options || {};
	
	    MovingObject.call(this, $canvas, $.extend(defaults, options));
	};
	
	// bullet class constants
	Bullet.RADIUS = 8;
	Bullet.COLOR = '#000';
	
	Util.inherits(Bullet, MovingObject);
	
	module.exports = Bullet;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Bullet = __webpack_require__(3);
	var Game = function($canvas, shooterRight, shooterLeft, targetRight, targetLeft) {
	    this.$canvas = $canvas;
	    this.ctx = this.$canvas[0].getContext("2d");
	
	    this.numBullets = 35
	    this.bulletArr = [];
	
	    // Indicates percent of Y-axis exits blocked by
	    // buffers. Eg, with two 25% buffers, 50% of each
	    // exit will be blocked.
	    this.bufferHeight = 0.25;
	
	    this.width = $canvas.width();
	    this.height = $canvas.height();
	
	    this.shooterRight = shooterRight;
	    this.shooterLeft = shooterLeft;
	    this.shooterRight.draw();
	    this.shooterLeft.draw();
	
	    this.targetRight = targetRight;
	    this.targetLeft = targetLeft;
	
	    this.bulletArr.push(this.targetLeft);
	    this.bulletArr.push(this.targetRight);
	};
	
	Game.prototype.addBullets = function(numBullets, options) {
	    for (i = 0; i < numBullets; i++) {
	        var side = ["l", "r"][Math.floor(Math.random() * 2)];
	        this.bulletArr.push(new Bullet(side, this.$canvas, options));
	    }
	};
	
	// Draw vertical grid in background of canvas
	Game.prototype.drawGrid = function(ctx) {
	    var spacing = 25;
	    var i;
	    for (i = 0; i < Math.ceil(this.$canvas.width() / spacing); i++) {
	        var x = spacing * i;
	        ctx.moveTo(x, 0);
	        ctx.lineTo(x, this.$canvas.height());
	        ctx.strokeStyle = '#b58900';
	        ctx.lineWidth = 1;
	        ctx.stroke();
	    }
	};
	
	// render all bullets
	Game.prototype.draw = function() {
	    this.drawGrid(this.ctx);
	    this.drawBuffers();
	    this.bulletArr.forEach(function(bullet) {
	        bullet.draw(bullet.ctx);
	    });
	
	    this.updateShooters();
	
	    this.targetRight.draw(this.targetRight.ctx);
	    this.targetLeft.draw(this.targetLeft.ctx);
	};
	
	// update positions of all bullets
	Game.prototype.move = function() {
	    this.ctx.clearRect(0, 0, this.width, this.height);
	    this.bulletArr.forEach(function(bullet, idx) {
	        bullet.move();
	        bullet.bounceCheck(this.bufferHeight);
	        if (bullet.outOfBounds === true) {
	            this.bulletArr.splice(idx, 1);
	        }
	    }.bind(this));
	};
	
	// Targets are first two objs in this.bulletArr
	// So bullets should never be "i" iterator when
	//  target is "j" iterator
	Game.prototype.checkCollisions = function() {
	
	    for (i = 0; i < this.bulletArr.length; i++) {
	        bulletOne = this.bulletArr[i];
	
	        for (j = i + 1; j < this.bulletArr.length; j++) {
	            bulletTwo = this.bulletArr[j];
	
	            if (bulletOne.isCollidedWith(bulletTwo)) {
	                if (bulletOne.target && !bulletTwo.target) {
	                    bulletOne.targetBulletBounce(bulletTwo);
	                } else {
	                    bulletOne.objectBounce(bulletTwo);
	                }
	            }
	        }
	
	        bulletOne.bounceRecency++;
	    }
	};
	
	Game.prototype.updateShooters = function () {
	    [this.shooterRight, this.shooterLeft].forEach (function (shooter) {
	        if (shooter.aimUp === true) {
	            shooter.aim("up");
	        } else if (shooter.aimDown === true) {
	            shooter.aim("down");
	        }
	    });
	};
	
	Game.prototype.drawBuffers = function () {
	    this.ctx.fillStyle = '#b58900';
	    this.ctx.moveTo(0, 0);
	    this.ctx.lineTo(0, this.$canvas.height() * this.bufferHeight);
	    this.ctx.lineTo(this.$canvas.width() / 2, 0);
	    this.ctx.fill();
	
	    this.ctx.moveTo(0, this.$canvas.height());
	    this.ctx.lineTo(0, this.$canvas.height() - this.bufferHeight * this.$canvas.height());
	    this.ctx.lineTo(this.$canvas.width() / 2, this.$canvas.height());
	    this.ctx.fill();
	
	    this.ctx.moveTo(this.$canvas.width(), this.$canvas.height());
	    this.ctx.lineTo(this.$canvas.width(), this.$canvas.height() - this.bufferHeight * this.$canvas.height());
	    this.ctx.lineTo(this.$canvas.width() / 2, this.$canvas.height());
	    this.ctx.fill();
	
	    this.ctx.moveTo(this.$canvas.width(), 0);
	    this.ctx.lineTo(this.$canvas.width(), this.bufferHeight * this.$canvas.height());
	    this.ctx.lineTo(this.$canvas.width() / 2, 0);
	    this.ctx.fill();
	};
	
	module.exports = Game;


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports) {

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
	    this.aimUp = false;
	    this.aimDown = false;
	
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
	        aimY -= 0.05;
	    } else if (dir === "down") {
	        aimY += 0.05;
	    }
	
	    if (aimY > 2.2) {
	        aimY = 2.2;
	    } else if (aimY < -2.2) {
	        aimY = -2.2;
	    }
	
	    var aimX = Math.sqrt(9 - Math.pow(aimY, 2));
	
	    aimX = this.side === "right" ? aimX * -1 : aimX;
	
	    this.vel = { x: aimX, y: aimY };
	
	    this.draw();
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(1);
	var Util = __webpack_require__(2);
	
	var Target = function ($canvas, side) {
	  this.$canvas = $canvas;
	  this.ctx = $canvas[0].getContext("2d");
	  this.side = side;
	  this.target = true;
	
	  var defaults = {
	    radius: 40,
	    vel: {x: 0, y: 0}
	  };
	
	  if (this.side === "right") {
	    this.color = "#268bd2";
	    defaults.color = "#268bd2";
	    defaults.pos = {
	      x: this.$canvas.width() * 0.7,
	      y: this.$canvas.height() / 4
	    };
	  } else if (this.side === "left") {
	    this.color = "#dc322f";
	    defaults.color = "#dc322f";
	    defaults.pos = {
	      x: this.$canvas.width() * 0.3,
	      y: this.$canvas.height() * 3 / 4
	    };
	  }
	
	
	  MovingObject.call(this, $canvas, defaults);
	};
	
	Util.inherits(Target, MovingObject);
	
	
	
	
	module.exports = Target;
	


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map