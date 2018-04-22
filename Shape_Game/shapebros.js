// The basics were learned from https://robots.thoughtbot.com/pong-clone-in-javascript

var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame||
  window.mozRequestAnimationFrame ||
  function(callback) {window.setTimeout(callback, 1000/60)};

var canvas = document.createElement('canvas');
var width = 1000;
var height = 600;
var keysDown = {};
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

window.onload = function() {
  document.body.appendChild(canvas)
  animate(step);
};

window.addEventListener("keydown", function() {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function() {
  delete keysDown[event.keyCode];
})

var step = function() {
  update();
  render();
  animate(step);
};

var player = new Player(300, 275, false);
var enemy = new Enemy(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 600), false);
var enemy2 = new Enemy(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 600), false);
var enemy3 = new Enemy(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 600), false);
var enemy4 = new Enemy(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 600), false);
var enemy5 = new Enemy(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 600), false);
var start = new Date();
var elapsed = 0;
context.fillStyle = "black";
context.fillText("Hello!", 500, 200);


var update = function() {
  player.update();
  enemy.update(player);
  enemy2.update(player);
  enemy3.update(player);
  enemy4.update(player);
  enemy5.update(player);
  elapsed = new Date() - start;
};

var lev = new Level();



var render = function() {
  context.fillStyle = "skyBlue";
  context.fillRect(0, 0, width, height);
  lev.render();
  player = new Player(player.x, player.y, player.dead);
  enemy = new Enemy(enemy.x, enemy.y, enemy.dead);
  enemy2 = new Enemy(enemy2.x, enemy2.y, enemy2.dead);
  enemy3 = new Enemy(enemy3.x, enemy3.y, enemy3.dead);
  enemy4 = new Enemy(enemy4.x, enemy4.y, enemy4.dead);
  enemy5 = new Enemy(enemy5.x, enemy5.y, enemy5.dead);
};

function Platform(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Platform.prototype.render = function () {
  context.fillStyle = "black";
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Level() {
  this.cenplat = new Platform(125, 325, 700, 50);
  this.lwall = new Platform(0, 0, 10, 100);
  this.lwall2 = new Platform(0, 200, 10, 200);
  this.wall = new Platform(990, 0, 10, 100);
  this.wall2 = new Platform(990, 200, 10, 200);
  this.lplat = new Platform(0, 200, 125, 50);
  this.plat = new Platform(875, 200, 125, 50);
  this.floor = new Platform(0, 475, 1000, 125);
}

Level.prototype.render = function () {
  this.cenplat.render();
  this.lwall.render();
  this.lwall2.render();
  this.wall.render();
  this.wall2.render();
  this.lplat.render();
  this.plat.render();
  this.floor.render();
};

function Player(x, y, dead) {
  this.x = x;
  this.y = y;
  this.dead = dead;

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + 25, y + 25);
  context.lineTo(x - 25, y + 25);
  context.closePath();

  context.lineWidth = 10;
  context.strokeStyle = "white";
  context.stroke();

  context.fillStyle = "white";
  context.fill();

  this.xspeed = 3;
  this.yspeed = 2;
  this.jumpheight = 5;
}

Player.prototype.update = function () {
  for (var key in keysDown) {
    var value = Number(key);
    if(value === 37 && this.dead == false) {
      this.collision();
      this.x -= this.xspeed;
    } else if(value === 39 && this.dead == false) {
      this.collision();
      this.x += this.xspeed;
    }
    if(value === 38 && this.dead == false){
      this.collision();
      this.y -= this.jumpheight;
    }
  }
  this.collision()
  this.y += this.yspeed;
  this.yspeed = 2;
  this.xspeed = 3;
  this.jumpheight = 5;
};

Player.prototype.collision = function() {
  if ((this.y >= 300 && this.y <= 350 && this.x >= 125 && this.x <= 825) || this.y >= 450) {
    this.yspeed = 0;
  }
  if ((this.x <= 30 && this.y < 100) || (this.x >= 970 && this.y < 100) || (this.x <= 155 && this.y <= 250 && this.y >= 200) || (this.x >= 845 && this. y <= 250 && this.y >= 200)) {
    this.xspeed = 0;
  }
  if((this.x <= 30 && this.y <= 400 && this.y >= 200) || (this.x >= 960 && this.y <= 400 && this.y >= 200)) {
    this.xspeed = 0;
  }
  if (this.y <= 200 && this.y >= 175 && (this.x <= 150 || this.x >= 850)) {
    this.yspeed = 0;
  }
}

Player.prototype.kill = function() {
  if(this.y + 10 == enemy.y && this.x - 50 <= enemy.x && this.x + 50 >= enemy.x) {
    this.dead = true;
  }
}

function Enemy(x, y, dead) {
  this.x = x
  this.y = y
  this.xspeed = 2;
  this.yspeed = 2;
  this.radius = 10
  this.dead = dead;
  context.beginPath();
  context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
  context.fillStyle = "red";
  context.fill();
}

Enemy.prototype.kill = function() {
  if(this.x >= player.x && this.x <= player.x + 50 && player.y === this.y) {
    this.dead = true;
  }
}

Enemy.prototype.collide = function() {
  if ((this.y >= 300 && this.y <= 350 && this.x >= 125 && this.x <= 825) || this.y >= 450) {
    this.yspeed = 0;
  }
  if ((this.x <= 30 && this.y < 100) || (this.x >= 970 && this.y < 100) || (this.x <= 155 && this.y <= 250 && this.y >= 200) || (this.x >= 845 && this. y <= 250 && this.y >= 200)) {
    this.xspeed = 0;
  }
  if((this.x <= 30 && this.y <= 400 && this.y >= 200) || (this.x >= 960 && this.y <= 400 && this.y >= 200)) {
    this.xspeed = 0;
  }
  if (this.y <= 200 && this.y >= 175 && (this.x <= 150 || this.x >= 850)) {
    this.yspeed = 0;
  }
}

Enemy.prototype.update = function(player) {
  if (this.y <= player.y + 100 && this.y >= player.y - 100 && this.dead == false) {
    if(this.x <= player.x) {
      this.x += this.xspeed;
    } else {
      this.x -= this.xspeed;
    }
  }
  this.kill();
  this.collide();
  this.y += this.yspeed;
}
