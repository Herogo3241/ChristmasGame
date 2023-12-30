class Player {
  constructor({ position }) {
    this.position = position;
    this.height = 90;
    this.width = 140;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.frameIndex = 0;
    this.frameCounter = 0;
    this.frameDelay = 20;
    this.frames = new Image();
    this.frames.src = "./assets/characters/santa+sleigh.png";
    this.frameWidth = 0;

    this.frames.onload = () => {
      this.frameWidth = this.frames.width / 6;
    };
  }

  initialize() {
    this.position = {
      x: canvas.width / 2 - 150,
      y: canvas.height / 2,
    };
    playerMovement = 0;
  }

  startGame() {
    if (!gameStarted || gameOver) playerMovement = 0;
    else {
      this.velocity.y = playerMovement;
      this.position.y += this.velocity.y * speedScaling;
    }
  }

  draw() {
    if (this.frameWidth > 0) {
      c.fillStyle = "rgba(255, 0, 0, 0.4)";
      c.drawImage(
        this.frames,
        this.frameIndex * this.frameWidth,
        0,
        this.frameWidth,
        this.frames.height,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }

    //  Uncomment to see the collision area
    // c.fillStyle = "rgba(255 , 0,0,0.4)";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    if (gameStarted) {
      this.frameCounter++;

      if (this.frameCounter >= this.frameDelay) {
        this.frameIndex = (this.frameIndex + 1) % 6;
        this.frameCounter = 0;
      }
      this.startGame();
    }
  }
}
