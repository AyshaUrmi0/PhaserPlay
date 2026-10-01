import { useEffect, useState, useRef } from "react";
import Phaser from "phaser";
import StartScreen from "../components/StartScreen";
import GameOverModal from "../components/GameOverModal";

const GameScene = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [gameOverData, setGameOverData] = useState(null);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("phaserplay_highscore") || "0", 10);
  });

  const gameRef = useRef(null);

  const restartGame = () => {
    setGameOverData(null);
    setGameKey((prev) => prev + 1);
  };

  const returnToMenu = () => {
    setGameOverData(null);
    setGameStarted(false);
  };

  useEffect(() => {
    if (!gameStarted) return;

    let score = 0;
    let scoreText;
    let gameOver = false;
    let mouseControlActive = false;

    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "phaser-game",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    function preload() {
      this.load.image("sky", "assets/sky.png");
      this.load.image("ground", "assets/platform.png");
      this.load.image("star", "assets/star.png");
      this.load.image("bomb", "assets/bomb.png");
      this.load.spritesheet("dude", "assets/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
    }

    function create() {
      this.add.image(400, 300, "sky");

      // Platforms
      this.platforms = this.physics.add.staticGroup();
      this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
      this.platforms.create(600, 400, "ground");
      this.platforms.create(50, 250, "ground");
      this.platforms.create(750, 220, "ground");

      // Player
      this.player = this.physics.add.sprite(100, 450, "dude");
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.player.body.setGravityY(300);
      this.physics.add.collider(this.player, this.platforms);

      // Player animations
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      // Stars
      this.stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });
      this.physics.add.collider(this.stars, this.platforms);
      this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

      // Bombs
      this.bombs = this.physics.add.group();
      this.physics.add.collider(this.bombs, this.platforms);
      this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);

      // Controls: Keyboard (Cursors + WASD + Space)
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      });

      // Mouse & Pointer Controls
      this.input.on("pointermove", () => {
        mouseControlActive = true;
      });

      // Jump on mouse click / tap
      this.input.on("pointerdown", () => {
        mouseControlActive = true;
        if (
          this.player &&
          this.player.body &&
          this.player.body.touching.down &&
          !gameOver
        ) {
          this.player.setVelocityY(-550);
        }
      });

      // Score HUD
      scoreText = this.add.text(16, 16, `Score: 0   🏆 Best: ${highScore}`, {
        fontSize: "22px",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        fontStyle: "bold",
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 4,
        shadow: { blur: 4, color: "#000000", fill: true },
      });
    }

    function collectStar(player, star) {
      star.disableBody(true, true);
      score += 10;
      const currentBest = Math.max(score, highScore);
      scoreText.setText(`Score: ${score}   🏆 Best: ${currentBest}`);

      if (this.stars.countActive(true) === 0) {
        this.stars.children.iterate((child) => {
          child.enableBody(true, child.x, 0, true, true);
        });

        const x =
          player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);
        const bomb = this.bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }

    function hitBomb(player, bomb) {
      if (gameOver) return;
      gameOver = true;

      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play("turn");
      this.cameras.main.shake(250, 0.015);

      const currentBest = parseInt(
        localStorage.getItem("phaserplay_highscore") || "0",
        10
      );
      const isNewHigh = score > currentBest;
      const finalBest = Math.max(score, currentBest);

      if (isNewHigh) {
        localStorage.setItem("phaserplay_highscore", finalBest.toString());
        setHighScore(finalBest);
      }

      setTimeout(() => {
        setGameOverData({
          score,
          stars: Math.floor(score / 10),
          highScore: finalBest,
          isNewHigh,
        });
      }, 600);
    }

    function update() {
      if (gameOver) return;

      const isKeyLeft = this.cursors.left.isDown || this.wasd.left.isDown;
      const isKeyRight = this.cursors.right.isDown || this.wasd.right.isDown;
      const isKeyJump =
        this.cursors.up.isDown ||
        this.wasd.up.isDown ||
        this.wasd.space.isDown;

      // Yield mouse control when keyboard is used
      if (isKeyLeft || isKeyRight || isKeyJump) {
        mouseControlActive = false;
      }

      let isLeft = isKeyLeft;
      let isRight = isKeyRight;
      let isJump = isKeyJump;

      // Mouse pointer guidance
      if (mouseControlActive) {
        const pointer = this.input.activePointer;
        if (
          pointer &&
          pointer.x >= 0 &&
          pointer.x <= 800 &&
          pointer.y >= 0 &&
          pointer.y <= 600
        ) {
          const deltaX = pointer.x - this.player.x;
          // Deadzone of 25px so character stands still when under the cursor
          if (deltaX < -25) {
            isLeft = true;
          } else if (deltaX > 25) {
            isRight = true;
          }
        }
      }

      if (isLeft) {
        this.player.setVelocityX(-160);
        this.player.anims.play("left", true);
      } else if (isRight) {
        this.player.setVelocityX(160);
        this.player.anims.play("right", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("turn");
      }

      if (isJump && this.player.body.touching.down) {
        this.player.setVelocityY(-550);
      }
    }

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      game.destroy(true);
    };
  }, [gameStarted, gameKey]);

  return (
    <div
      id="phaser-game"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundColor: "#111827",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      {!gameStarted && (
        <StartScreen
          highScore={highScore}
          onStart={() => setGameStarted(true)}
        />
      )}

      <GameOverModal
        data={gameOverData}
        onRestart={restartGame}
        onMenu={returnToMenu}
      />
    </div>
  );
};

export default GameScene;
