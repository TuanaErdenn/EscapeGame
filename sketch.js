let butterfly;
let obstacles = [];
let score = 0;
let gameOver = false;
let obstacleTimer = 0;
let clouds = [];
let sparkles = [];

function setup() {
  createCanvas(800, 400);
  butterfly = new Butterfly();
  textSize(24);
  textFont("Georgia");


  for (let i = 0; i < 5; i++) {
    clouds.push(new Cloud());
  }
}

function draw() {
  background(135, 206, 250); 
  drawSun();
  drawGround();


  for (let c of clouds) {
    c.update();
    c.display();
  }

  for (let i = sparkles.length - 1; i >= 0; i--) {
    sparkles[i].update();
    sparkles[i].display();
    if (sparkles[i].isDone()) {
      sparkles.splice(i, 1);
    }
  }

  if (!gameOver) {
    butterfly.update();
    butterfly.display();

    handleObstacles();

    score += 1 / 60;
  } else {
    fill(200, 30, 30);
    textAlign(CENTER, CENTER);
    text("🐛🌿 GAME OVER 🌿🐛", width / 2, height / 2 - 20);
    text("Skor: " + floor(score), width / 2, height / 2 + 20);
  }

  drawScore();
}

function drawScore() {
  fill(0);
  textAlign(LEFT);
  text("⏱️ Skor: " + floor(score), 10, 30);
}

function drawSun() {
  fill(255, 255, 0);
  noStroke();
  ellipse(100, 80, 80);
}

function drawGround() {
  fill(0, 200, 0);
  rect(0, height - 20, width, 20);
}

function keyPressed() {
  if (gameOver) {
    if (key === 'r') {
      resetGame();
    }
    return; 
  }
  if (keyCode === LEFT_ARROW) {
    butterfly.move(-1);
  }

  if (keyCode === RIGHT_ARROW) {
    butterfly.move(1);
  }

  if ((keyCode === UP_ARROW || key === ' ') && butterfly.jumpCount < 2) {
    butterfly.jump();

    for (let i = 0; i < 10; i++) {
      sparkles.push(new Sparkle(butterfly.x, butterfly.y + butterfly.r));
    }
  }
}



function resetGame() {
  obstacles = [];
  score = 0;
  gameOver = false;
  butterfly = new Butterfly();
}

function handleObstacles() {
  obstacleTimer--;
  if (obstacleTimer <= 0) {
    obstacles.push(new Obstacle());
    obstacleTimer = int(random(60, 120));
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();

    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
    } else if (obstacles[i].hits(butterfly)) {
      gameOver = true;
    }
  }
}

class Butterfly {
  constructor() {
    this.r = 20;
    this.x = 80;
    this.y = height - 20 - this.r;
    this.vy = 0;
    this.gravity = 0.8;
    this.jumpCount = 0;
  }

  update() {
    this.y += this.vy;
    this.vy += this.gravity;

    if (this.y >= height - 20 - this.r) {
      this.y = height - 20 - this.r;
      this.vy = 0;
      this.jumpCount = 0;
    }
  }

  display() {
  
    noStroke();
    fill(255, 150, 200, 180);
    ellipse(this.x - 15, this.y - 15, this.r * 1.8, this.r * 2.2);
    ellipse(this.x + 15, this.y - 15, this.r * 1.8, this.r * 2.2);
    fill(200, 100, 255, 180);
    ellipse(this.x - 15, this.y + 10, this.r * 1.4, this.r * 1.6);
    ellipse(this.x + 15, this.y + 10, this.r * 1.4, this.r * 1.6);

    fill(80, 80, 150);
    ellipse(this.x, this.y, this.r * 0.8, this.r * 2);
    fill(255);
    ellipse(this.x, this.y - this.r, this.r * 0.6);
  }

  move(dir) {
    this.x += dir * 10;
    this.x = constrain(this.x, this.r, width - this.r);
  }

  jump() {
    this.vy = -12;
    this.jumpCount++;
  }
}

class Obstacle {
  constructor() {
    this.w = random(20, 60);
    this.h = random(30, 120);
    this.x = width + this.w;
    this.y = height - 20 - this.h;
    this.speed = 6;
  }

  update() {
    this.x -= this.speed;
  }

  display() {
    fill(255, 80, 80);
    rect(this.x, this.y, this.w, this.h);
  }

  offscreen() {
    return this.x + this.w < 0;
  }

  hits(p) {
    let testX = p.x;
    let testY = p.y;

    if (p.x < this.x) testX = this.x;
    else if (p.x > this.x + this.w) testX = this.x + this.w;
    if (p.y < this.y) testY = this.y;
    else if (p.y > this.y + this.h) testY = this.y + this.h;

    let distX = p.x - testX;
    let distY = p.y - testY;
    let distance = sqrt(distX * distX + distY * distY);

    return distance <= p.r;
  }
}

class Cloud {
  constructor() {
    this.x = random(width, width + 200);
    this.y = random(30, 120);
    this.w = random(60, 120);
    this.h = random(30, 50);
    this.speed = random(0.5, 1.5);
  }

  update() {
    this.x -= this.speed;
    if (this.x + this.w < 0) {
      this.x = width + random(100, 300);
    }
  }

  display() {
    fill(255, 255, 255, 200);
    noStroke();
    ellipse(this.x, this.y, this.w, this.h);
    ellipse(this.x + 20, this.y + 10, this.w * 0.8, this.h * 0.8);
    ellipse(this.x - 20, this.y + 10, this.w * 0.8, this.h * 0.8);
  }
}

class Sparkle {
  constructor(x, y) {
    this.x = x + random(-10, 10);
    this.y = y + random(-10, 10);
    this.r = random(2, 5);
    this.life = 255;
  }

  update() {
    this.life -= 5;
  }

  display() {
    fill(255, 255, 100, this.life);
    noStroke();
    ellipse(this.x, this.y, this.r);
  }

  isDone() {
    return this.life <= 0;
  }
}
