import { useEffect, useState, useRef } from "react";
import Phaser from "phaser";
import StartScreen from "../components/StartScreen";
import GameOverModal from "../components/GameOverModal";
import SoundToggle from "../components/SoundToggle";
import { soundEffects } from "../utils/audio";
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
    let lives = 3;
    let isInvulnerable = false;
    let wave = 1;

    const getHearts = (count) => {
      return "❤️".repeat(Math.max(0, count)) + "🤍".repeat(Math.max(0, 3 - count));
    };

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
          soundEffects.playJump();
        }
      });

      // Score HUD
      scoreText = this.add.text(16, 16, `Score: 0   🚩 Wave 1   ${getHearts(3)}   🏆 Best: ${highScore}`, {
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
      scoreText.setText(
        `Score: ${score}   🚩 Wave ${wave}   ${getHearts(lives)}   🏆 Best: ${currentBest}`
      );

      // Floating +10 score feedback
      const floatText = this.add.text(star.x, star.y - 10, "+10", {
        fontSize: "16px",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        fontStyle: "bold",
        fill: "#FBBF24",
        stroke: "#000000",
        strokeThickness: 3,
      });
      this.tweens.add({
        targets: floatText,
        y: star.y - 40,
        alpha: 0,
        duration: 600,
        onComplete: () => floatText.destroy(),
      });

      soundEffects.playCollect();

      if (this.stars.countActive(true) === 0) {
        wave += 1;
        soundEffects.playWaveClear();

        // Wave advancement banner
        const waveBanner = this.add.text(400, 300, `🚩 WAVE ${wave}!`, {
          fontSize: "42px",
          fontFamily: "'Segoe UI', Roboto, sans-serif",
          fontStyle: "900",
          fill: "#A855F7",
          stroke: "#FFFFFF",
          strokeThickness: 4,
          shadow: { blur: 15, color: "#A855F7", fill: true },
        }).setOrigin(0.5);

        this.tweens.add({
          targets: waveBanner,
          scale: { from: 0.6, to: 1.2 },
          alpha: { from: 1, to: 0 },
          duration: 1200,
          onComplete: () => waveBanner.destroy(),
        });

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
      if (gameOver || isInvulnerable) return;

      lives -= 1;
      const currentBest = Math.max(score, highScore);
      scoreText.setText(
        `Score: ${score}   🚩 Wave ${wave}   ${getHearts(lives)}   🏆 Best: ${currentBest}`
      );

      soundEffects.playHit();

      // Floating damage indicator
      const damageText = this.add.text(player.x - 15, player.y - 25, "-1 ❤️", {
        fontSize: "18px",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        fontStyle: "bold",
        fill: "#EF4444",
        stroke: "#000000",
        strokeThickness: 3,
      });
      this.tweens.add({
        targets: damageText,
        y: player.y - 65,
        alpha: 0,
        duration: 700,
        onComplete: () => damageText.destroy(),
      });

      // Impact camera shake
      this.cameras.main.shake(200, 0.015);

      if (lives <= 0) {
        gameOver = true;
        soundEffects.playGameOver();
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");

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
            wave,
            highScore: finalBest,
            isNewHigh,
          });
        }, 600);
      } else {
        // Recovery & Invulnerability period (~1.4s)
        isInvulnerable = true;

        // Knockback away from bomb
        player.setVelocityY(-220);
        const bounceX = player.x < bomb.x ? -140 : 140;
        player.setVelocityX(bounceX);

        // Flashing blink tween
        player.setTint(0xff6b6b);
        this.tweens.add({
          targets: player,
          alpha: 0.25,
          duration: 120,
          ease: "Linear",
          yoyo: true,
          repeat: 5,
          onComplete: () => {
            player.clearTint();
            player.alpha = 1;
            isInvulnerable = false;
          },
        });
      }
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
        soundEffects.playJump();
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
      <SoundToggle />

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
