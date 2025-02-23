import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }
  create() {
    // ✅ Add background and set it to fill the entire screen
    this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
  
    // ✅ Scale the background to match the screen size
    this.background.displayWidth = this.scale.width;
    this.background.displayHeight = this.scale.height;
  
    // ✅ Make the background update when resizing
    this.scale.on("resize", (gameSize) => {
      this.background.displayWidth = gameSize.width;
      this.background.displayHeight = gameSize.height;
    });
  
    // Enable physics
    this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);
  
    // Add ground
    this.ground = this.matter.add.image(400, 580, "ground", null, {
      isStatic: true,
    });
  
    // Add bike as a physics body
    this.bike = this.matter.add.sprite(400, 500, "bike");
    this.bike.setFriction(0.5).setBounce(0.2);
  
    // Add input events to lift the front wheel
    this.input.on("pointerdown", () => {
      this.bike.applyForce({ x: 0, y: -0.03 });
    });
  
    // Score system
    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: "24px",
      fill: "#fff",
    });
  
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.score++;
        this.scoreText.setText("Score: " + this.score);
      },
      loop: true,
    });
  }
  
  

  preload() {
    this.load.image("background", "https://prod-cdn.flarie.com/asset/game-center/website-bg.png");

    this.load.image("bike", "/assets/bike.png"); // Add your bike sprite
    this.load.image("ground", "/assets/ground.png"); // Add ground
  }

  

  update() {
    if (this.bike.angle > 45 || this.bike.angle < -45) {
      this.scene.restart(); // Restart game if bike falls over
    }
  }
}
