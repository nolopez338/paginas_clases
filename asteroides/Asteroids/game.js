// Asteroids Game (Classic Arcade Clone)
// All code in this file is vanilla JS (ES6 modules)
// See index.html for Getting Started and controls

// --- Constants ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SHIP_SIZE = 30; // ship height in px
const TURN_SPEED = 0.07; // radians per frame
const ACCELERATION = 0.15;
const FRICTION = 0.99; // velocity damping
const BULLET_SPEED = 7;
const BULLET_LIFETIME = 60; // frames
const BULLET_RADIUS = 2;
const BULLET_MAX = 4;
const ASTEROID_NUM = 4; // starting asteroids
const ASTEROID_SIZE = 60; // large asteroid radius
const ASTEROID_SPEED = 1.5;
const ASTEROID_VERT = 10; // average vertices per asteroid
const ASTEROID_JAG = 0.4; // jaggedness (0 = none, 1 = lots)
const SHOW_BOUNDING = false; // for debugging
const TEXT_FADE_TIME = 60; // frames for text fade
const TEXT_SIZE = 32;
const LIVES = 3;
const INVINCIBLE_TIME = 120; // frames
const BLINK_TIME = 10; // frames per blink
const SCORE_LARGE = 20;
const SCORE_MEDIUM = 50;
const SCORE_SMALL = 100;

// --- Canvas Setup ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// --- Utility Functions ---
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

// --- Classes ---
class Ship {
  constructor() {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 2;
    this.r = SHIP_SIZE / 2;
    this.a = -Math.PI / 2; // facing up
    this.rot = 0;
    this.thrusting = false;
    this.thrust = { x: 0, y: 0 };
    this.blinkTime = Math.ceil(INVINCIBLE_TIME / BLINK_TIME);
    this.invincible = INVINCIBLE_TIME;
    this.dead = false;
    this.lives = LIVES;
    this.canShoot = true;
    this.bullets = [];
    this.score = 0;
  }
  draw() {
    if (this.invincible > 0 && this.blinkTime % 2 === 0) return; // blink effect
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.a);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.r, 0);
    ctx.lineTo(-this.r, -this.r * 0.6);
    ctx.lineTo(-this.r, this.r * 0.6);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  update() {
    // Rotation
    this.a += this.rot;
    // Thrust
    if (this.thrusting) {
      this.thrust.x += ACCELERATION * Math.cos(this.a);
      this.thrust.y += ACCELERATION * Math.sin(this.a);
    } else {
      this.thrust.x *= FRICTION;
      this.thrust.y *= FRICTION;
    }
    // Position
    this.x += this.thrust.x;
    this.y += this.thrust.y;
    // Edge wrap
    if (this.x < 0 - this.r) this.x = CANVAS_WIDTH + this.r;
    if (this.x > CANVAS_WIDTH + this.r) this.x = 0 - this.r;
    if (this.y < 0 - this.r) this.y = CANVAS_HEIGHT + this.r;
    if (this.y > CANVAS_HEIGHT + this.r) this.y = 0 - this.r;
    // Invincibility
    if (this.invincible > 0) {
      this.invincible--;
      if (this.invincible % BLINK_TIME === 0) this.blinkTime--;
    }
  }
  shoot() {
    if (this.canShoot && this.bullets.length < BULLET_MAX) {
      this.bullets.push(new Bullet(this.x + this.r * Math.cos(this.a), this.y + this.r * Math.sin(this.a), this.a));
      this.canShoot = false;
    }
  }
  respawn() {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 2;
    this.thrust = { x: 0, y: 0 };
    this.a = -Math.PI / 2;
    this.invincible = INVINCIBLE_TIME;
    this.blinkTime = Math.ceil(INVINCIBLE_TIME / BLINK_TIME);
    this.dead = false;
  }
}

class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.dx = BULLET_SPEED * Math.cos(angle);
    this.dy = BULLET_SPEED * Math.sin(angle);
    this.life = BULLET_LIFETIME;
    this.r = BULLET_RADIUS;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    // Edge wrap
    if (this.x < 0) this.x = CANVAS_WIDTH;
    if (this.x > CANVAS_WIDTH) this.x = 0;
    if (this.y < 0) this.y = CANVAS_HEIGHT;
    if (this.y > CANVAS_HEIGHT) this.y = 0;
    this.life--;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
  }
}

class Asteroid {
  constructor(x, y, r, level = 0) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.level = level; // 0: large, 1: medium, 2: small
    this.angle = randomRange(0, Math.PI * 2);
    this.vertices = Math.floor(randomRange(ASTEROID_VERT - 2, ASTEROID_VERT + 2));
    this.offsets = [];
    for (let i = 0; i < this.vertices; i++) {
      this.offsets.push(randomRange(1 - ASTEROID_JAG, 1 + ASTEROID_JAG));
    }
    const speed = randomRange(0.5, ASTEROID_SPEED) / (this.level + 1);
    this.dx = speed * Math.cos(this.angle);
    this.dy = speed * Math.sin(this.angle);
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    // Edge wrap
    if (this.x < 0 - this.r) this.x = CANVAS_WIDTH + this.r;
    if (this.x > CANVAS_WIDTH + this.r) this.x = 0 - this.r;
    if (this.y < 0 - this.r) this.y = CANVAS_HEIGHT + this.r;
    if (this.y > CANVAS_HEIGHT + this.r) this.y = 0 - this.r;
  }
  draw() {
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < this.vertices; i++) {
      const angle = (Math.PI * 2 / this.vertices) * i;
      const r = this.r * this.offsets[i];
      const x = this.x + r * Math.cos(angle);
      const y = this.y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    if (SHOW_BOUNDING) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'red';
      ctx.stroke();
      ctx.restore();
    }
  }
}

// --- Game State ---
let ship;
let asteroids = [];
let gameOver = false;
let paused = false;
let text = '';
let textAlpha = 0;

function newGame() {
  ship = new Ship();
  asteroids = [];
  gameOver = false;
  paused = false;
  text = '';
  textAlpha = 0;
  createAsteroids();
}

function createAsteroids() {
  asteroids = [];
  let i = 0;
  while (i < ASTEROID_NUM) {
    let x = randomRange(0, CANVAS_WIDTH);
    let y = randomRange(0, CANVAS_HEIGHT);
    // Don't spawn too close to ship
    if (dist(x, y, ship.x, ship.y) < ASTEROID_SIZE * 2 + ship.r) continue;
    asteroids.push(new Asteroid(x, y, ASTEROID_SIZE, 0));
    i++;
  }
}

// --- Input Handling ---
const keys = {};
document.addEventListener('keydown', e => {
  if (gameOver && e.code === 'Enter') {
    newGame();
    return;
  }
  if (e.code === 'KeyP') {
    paused = !paused;
    return;
  }
  keys[e.code] = true;
  if ((e.code === 'Space' || e.key === ' ') && !gameOver) ship.shoot();
});
document.addEventListener('keyup', e => {
  keys[e.code] = false;
  if (e.code === 'Space' || e.key === ' ') ship.canShoot = true;
});

// --- Game Loop ---
function update() {
  if (paused || gameOver) return;
  // Ship controls
  ship.thrusting = keys['ArrowUp'] || keys['KeyW'];
  ship.rot = 0;
  if (keys['ArrowLeft'] || keys['KeyA']) ship.rot = -TURN_SPEED;
  if (keys['ArrowRight'] || keys['KeyD']) ship.rot = TURN_SPEED;
  ship.update();
  // Bullets
  for (let i = ship.bullets.length - 1; i >= 0; i--) {
    ship.bullets[i].update();
    if (ship.bullets[i].life <= 0) ship.bullets.splice(i, 1);
  }
  // Asteroids
  for (let ast of asteroids) ast.update();
  // Bullet-asteroid collisions
  for (let i = asteroids.length - 1; i >= 0; i--) {
    for (let j = ship.bullets.length - 1; j >= 0; j--) {
      if (dist(asteroids[i].x, asteroids[i].y, ship.bullets[j].x, ship.bullets[j].y) < asteroids[i].r + ship.bullets[j].r) {
        // Split asteroid
        splitAsteroid(i);
        ship.bullets.splice(j, 1);
        break;
      }
    }
  }
  // Ship-asteroid collisions
  if (ship.invincible <= 0 && !ship.dead) {
    for (let i = 0; i < asteroids.length; i++) {
      if (dist(ship.x, ship.y, asteroids[i].x, asteroids[i].y) < ship.r + asteroids[i].r) {
        ship.lives--;
        ship.dead = true;
        if (ship.lives > 0) {
          setTimeout(() => {
            ship.respawn();
            ship.dead = false;
          }, 1000);
        } else {
          gameOver = true;
          text = `GAME OVER`;
          textAlpha = 1.0;
        }
        break;
      }
    }
  }
  // Remove dead asteroids
  asteroids = asteroids.filter(a => a.r > 0);
  // Win condition: all asteroids destroyed
  if (asteroids.length === 0 && !gameOver) {
    text = 'YOU WIN!';
    textAlpha = 1.0;
    gameOver = true;
  }
}

function splitAsteroid(i) {
  let a = asteroids[i];
  let score = 0;
  if (a.r > ASTEROID_SIZE / 2) {
    // Large -> 2 medium
    asteroids.push(new Asteroid(a.x, a.y, ASTEROID_SIZE / 2, 1));
    asteroids.push(new Asteroid(a.x, a.y, ASTEROID_SIZE / 2, 1));
    score = SCORE_LARGE;
  } else if (a.r > ASTEROID_SIZE / 4) {
    // Medium -> 2 small
    asteroids.push(new Asteroid(a.x, a.y, ASTEROID_SIZE / 4, 2));
    asteroids.push(new Asteroid(a.x, a.y, ASTEROID_SIZE / 4, 2));
    score = SCORE_MEDIUM;
  } else {
    // Small destroyed
    score = SCORE_SMALL;
  }
  ship.score += score;
  asteroids.splice(i, 1);
}

function drawText() {
  if (textAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = textAlpha;
    ctx.font = `${TEXT_SIZE}px 'Press Start 2P', monospace`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    if (gameOver) {
      ctx.font = '20px "Press Start 2P", monospace';
      ctx.fillText(`Final Score: ${ship.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
      ctx.fillText('Press Enter to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);
    }
    ctx.restore();
    if (!gameOver) textAlpha -= 1 / TEXT_FADE_TIME;
  }
}

function drawScoreAndLives() {
  ctx.save();
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE: ${ship.score}`, 20, 40);
  ctx.fillText(`LIVES: ${ship.lives}`, 20, 70);
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Draw asteroids
  for (let ast of asteroids) ast.draw();
  // Draw ship
  if (!ship.dead) ship.draw();
  // Draw bullets
  for (let b of ship.bullets) b.draw();
  // Draw score/lives
  drawScoreAndLives();
  // Draw text
  drawText();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// --- Start Game ---
newGame();
gameLoop(); 