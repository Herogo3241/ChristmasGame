const enemySpeed = 3;

class Enemy {
  constructor() {
    this.width = 60;
    this.height = 60;
    this.x = canvas.width + 200 * Math.floor(Math.random() * 5);
    this.y = Math.random() * (canvas.height - this.height);
    this.speed = 0;
    this.frameIndex = 0;
    this.frames = new Image();
    this.frames.src = "./assets/characters/bat1.png";
    this.frameWidth = 0;
    this.frameCounter = 0;
    this.frameDelay = 20;

    this.frames.onload = () => {
      this.frameWidth = this.frames.width / 2;
    };
  }

  initialize() {
    this.x = canvas.width + 100 * Math.floor(Math.random() * 20);
    this.y = Math.random() * (canvas.height - this.height);
    this.speed = 0;
  }
  draw() {
    if (this.frameWidth > 0) {
      c.drawImage(
        this.frames,
        this.frameIndex * this.frameWidth,
        0,
        this.frameWidth,
        this.frames.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    //  Uncomment to see the collision area
    // c.fillStyle = "rgba(0,255,0,0.4)";
    // c.fillRect(
    //     this.x,
    //     this.y,
    //     this.width,
    //     this.height
    // )
  }

  update() {
    if (gameStarted && !gameOver) this.speed = enemySpeed * speedScaling;
    this.x -= this.speed;

    if (this.x + this.width < 0) {
      this.x = canvas.width;
      this.y = Math.random() * (canvas.height - this.height);
    }
    this.frameCounter++;

    if (this.frameCounter >= this.frameDelay) {
      this.frameIndex = this.frameIndex === 0 ? 1 : 0;
      this.frameCounter = 0;
    }

    this.draw();
  }
}
