import { useEffect, useState, useRef } from "react";
import Phaser from "phaser";
import StartScreen from "../components/StartScreen";
import GameOverModal from "../components/GameOverModal";
import SoundToggle from "../components/SoundToggle";
import TouchControls from "../components/TouchControls";
import PauseModal from "../components/PauseModal";
import LeaderboardModal from "../components/LeaderboardModal";
import { soundEffects } from "../utils/audio";
const GameScene = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [gameOverData, setGameOverData] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("phaserplay_highscore") || "0", 10);
  });

  const gameRef = useRef(null);
  const touchInputsRef = useRef({ left: false, right: false, jump: false });

  const handleTouchMove = (direction, isDown) => {
    touchInputsRef.current[direction] = isDown;
  };

  const handleTouchJump = () => {
    touchInputsRef.current.jump = true;
  };

  const restartGame = () => {
    setGameOverData(null);
    setGameKey((prev) => prev + 1);
  };

  const returnToMenu = () => {
    setGameOverData(null);
    setIsPaused(false);
    setGameStarted(false);
  };

    const togglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      if (gameRef.current && gameRef.current.scene && gameRef.current.scene.scenes[0]) {
        if (next) {
          gameRef.current.scene.scenes[0].physics.pause();
        } else {
          gameRef.current.scene.scenes[0].physics.resume();
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const handleGlobalPauseKey = (e) => {
      if ((e.key === "p" || e.key === "P" || e.key === "Escape") && gameStarted && !gameOverData) {
        togglePause();
      }
    };
    window.addEventListener("keydown", handleGlobalPauseKey);
    return () => window.removeEventListener("keydown", handleGlobalPauseKey);
  }, [gameStarted, gameOverData]);

  useEffect(() => {
    if (!gameStarted) return;

    let score = 0;
    let scoreText;
    let gameOver = false;
    let mouseControlActive = false;
    let lives = 3;
    let isInvulnerable = false;
    let wave = 1;
    let jumpCount = 0;
    let hasShield = false;
    let comboCount = 0;
    let lastStarTime = 0;
    let wasInAir = false;
    let shieldGraphics;

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

            // Procedural textures for Shield & Diamond Power-ups
      if (!this.textures.exists("shield_item")) {
        const g = this.add.graphics();
        g.fillStyle(0x0284c7, 0.9);
        g.fillCircle(12, 12, 11);
        g.lineStyle(2, 0x38bdf8, 1);
        g.strokeCircle(12, 12, 11);
        g.fillStyle(0xffffff, 1);
        g.fillRect(10, 5, 4, 14);
        g.fillRect(5, 10, 14, 4);
        g.generateTexture("shield_item", 24, 24);
        g.destroy();
      }

      if (!this.textures.exists("diamond_item")) {
        const g = this.add.graphics();
        g.fillStyle(0x38bdf8, 1);
        g.beginPath();
        g.moveTo(12, 2);
        g.lineTo(22, 12);
        g.lineTo(12, 22);
        g.lineTo(2, 12);
        g.closePath();
        g.fillPath();
        g.lineStyle(2, 0xffffff, 0.9);
        g.strokePath();
        g.generateTexture("diamond_item", 24, 24);
        g.destroy();
      }

            // Procedural particles (Sparkles & Landing Dust)
      if (!this.textures.exists("spark_particle")) {
        const g = this.add.graphics();
        g.fillStyle(0xfbbf24, 1);
        g.fillCircle(3, 3, 3);
        g.generateTexture("spark_particle", 6, 6);
        g.destroy();
      }

      if (!this.textures.exists("dust_particle")) {
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.6);
        g.fillCircle(3, 3, 3);
        g.generateTexture("dust_particle", 6, 6);
        g.destroy();
      }

      // Power-up Groups
      this.shields = this.physics.add.group();
      this.diamonds = this.physics.add.group();
      this.physics.add.collider(this.shields, this.platforms);
      this.physics.add.collider(this.diamonds, this.platforms);
      this.physics.add.overlap(this.player, this.shields, collectShield, null, this);
      this.physics.add.overlap(this.player, this.diamonds, collectDiamond, null, this);

      // Active player shield bubble graphics
      shieldGraphics = this.add.graphics();

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

      // Jump on mouse click / tap (Supports Double Jump)
      this.input.on("pointerdown", () => {
        mouseControlActive = true;
        if (this.player && this.player.body && !gameOver) {
          if (this.player.body.touching.down) {
            jumpCount = 1;
            this.player.setVelocityY(-550);
            soundEffects.playJump();
          } else if (jumpCount === 1) {
            jumpCount = 2;
            this.player.setVelocityY(-480);
            soundEffects.playJump();
          }
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

        function collectShield(player, shield) {
      shield.disableBody(true, true);
      hasShield = true;
      soundEffects.playShield();

      const shieldText = this.add.text(player.x - 20, player.y - 30, "🛡️ SHIELD!", {
        fontSize: "16px",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        fontStyle: "bold",
        fill: "#38BDF8",
        stroke: "#000000",
        strokeThickness: 3,
      });
      this.tweens.add({
        targets: shieldText,
        y: player.y - 65,
        alpha: 0,
        duration: 700,
        onComplete: () => shieldText.destroy(),
      });
    }

    function collectDiamond(player, diamond) {
      diamond.disableBody(true, true);
      score += 50;
      soundEffects.playDiamond();
      const currentBest = Math.max(score, highScore);
      scoreText.setText(
        `Score: ${score}   🚩 Wave ${wave}   ${getHearts(lives)}   🏆 Best: ${currentBest}`
      );

      const dText = this.add.text(diamond.x, diamond.y - 10, "+50 💎", {
        fontSize: "18px",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        fontStyle: "bold",
        fill: "#38BDF8",
        stroke: "#000000",
        strokeThickness: 4,
      });
      this.tweens.add({
        targets: dText,
        y: diamond.y - 45,
        alpha: 0,
        duration: 700,
        onComplete: () => dText.destroy(),
      });
    }

    function collectStar(player, star) {
      star.disableBody(true, true);

      // Combo system (Within 2.5s window)
      const now = this.time.now;
      if (now - lastStarTime < 2500) {
        comboCount = Math.min(comboCount + 1, 5);
      } else {
        comboCount = 1;
      }
      lastStarTime = now;

      const pointsEarned = 10 * comboCount;
      score += pointsEarned;
      const currentBest = Math.max(score, highScore);
      scoreText.setText(
        `Score: ${score}   🚩 Wave ${wave}   ${getHearts(lives)}   🏆 Best: ${currentBest}`
      );

      soundEffects.playCollect(comboCount);

      // Star Sparkle Particles Burst
      for (let i = 0; i < 6; i++) {
        const p = this.physics.add.image(star.x, star.y, "spark_particle");
        p.body.setAllowGravity(false);
        const angle = (Math.PI * 2 * i) / 6;
        p.setVelocity(Math.cos(angle) * 110, Math.sin(angle) * 110);
        this.tweens.add({
          targets: p,
          alpha: 0,
          scale: 0.2,
          duration: 350,
          onComplete: () => p.destroy(),
        });
      }

      // Floating score & combo popup
      const comboLabel = comboCount > 1 ? `+${pointsEarned} (${comboCount}x COMBO!)` : "+10";
      const comboColor = comboCount > 2 ? "#C084FC" : comboCount > 1 ? "#F59E0B" : "#FBBF24";

      const floatText = this.add.text(star.x - 10, star.y - 12, comboLabel, {
        fontSize: comboCount > 1 ? "18px" : "16px",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        fontStyle: "bold",
        fill: comboColor,
        stroke: "#000000",
        strokeThickness: comboCount > 1 ? 4 : 3,
      });
      this.tweens.add({
        targets: floatText,
        y: star.y - (comboCount > 1 ? 55 : 40),
        alpha: 0,
        duration: 650,
        onComplete: () => floatText.destroy(),
      });

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

                // Spawn Bonus Diamond on wave clear
        const dx = Phaser.Math.Between(80, 720);
        const diamond = this.diamonds.create(dx, 60, "diamond_item");
        diamond.setBounce(0.3);
        diamond.setCollideWorldBounds(true);

        // Spawn Shield Orb every 2 waves
        if (wave % 2 === 0) {
          const sx = Phaser.Math.Between(100, 700);
          const shield = this.shields.create(sx, 60, "shield_item");
          shield.setBounce(0.2);
          shield.setCollideWorldBounds(true);
        }

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

      // Shield blocks bomb damage completely!
      if (hasShield) {
        hasShield = false;
        soundEffects.playShieldBreak();
        this.cameras.main.shake(150, 0.01);

        const blockedText = this.add.text(player.x - 30, player.y - 30, "🛡️ DEFLECTED!", {
          fontSize: "16px",
          fontFamily: "'Segoe UI', Roboto, sans-serif",
          fontStyle: "bold",
          fill: "#38BDF8",
          stroke: "#000000",
          strokeThickness: 3,
        });
        this.tweens.add({
          targets: blockedText,
          y: player.y - 65,
          alpha: 0,
          duration: 700,
          onComplete: () => blockedText.destroy(),
        });

        // Knock bomb back
        bomb.setVelocity(Phaser.Math.Between(-240, 240), -200);
        return;
      }

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

        // Persist run to Top 5 Leaderboard
        try {
          const raw = localStorage.getItem("phaserplay_leaderboard");
          const list = raw ? JSON.parse(raw) : [];
          list.push({
            score,
            wave,
            stars: Math.floor(score / 10),
            date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          });
          list.sort((a, b) => b.score - a.score);
          localStorage.setItem("phaserplay_leaderboard", JSON.stringify(list.slice(0, 5)));
        } catch {}

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

      // Render pulsating shield bubble around player
      if (shieldGraphics) {
        shieldGraphics.clear();
        if (hasShield && this.player && !gameOver) {
          const pulse = 0.75 + Math.sin(this.time.now / 150) * 0.25;
          shieldGraphics.lineStyle(3, 0x38bdf8, pulse);
          shieldGraphics.fillStyle(0x0ea5e9, 0.22);
          shieldGraphics.strokeCircle(this.player.x, this.player.y, 28);
          shieldGraphics.fillCircle(this.player.x, this.player.y, 28);
        }
      }

      // Reset jump count on landing
      if (this.player.body.touching.down) {
        jumpCount = 0;
      }

      // Landing dust puff effect
      if (this.player.body.touching.down && wasInAir) {
        wasInAir = false;
        [-10, 10].forEach((offset) => {
          const d = this.add.image(this.player.x + offset, this.player.y + 20, "dust_particle");
          this.tweens.add({
            targets: d,
            scaleX: 1.8,
            scaleY: 0.3,
            alpha: 0,
            duration: 250,
            onComplete: () => d.destroy(),
          });
        });
      } else if (!this.player.body.touching.down) {
        wasInAir = true;
      }

      const isKeyLeft = this.cursors.left.isDown || this.wasd.left.isDown;
      const isKeyRight = this.cursors.right.isDown || this.wasd.right.isDown;
      const isTouchLeft = touchInputsRef.current.left;
      const isTouchRight = touchInputsRef.current.right;

      // Yield mouse control when keyboard or touch controls are used
      if (isKeyLeft || isKeyRight || isTouchLeft || isTouchRight) {
        mouseControlActive = false;
      }

      let isLeft = isKeyLeft || isTouchLeft;
      let isRight = isKeyRight || isTouchRight;

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
          if (deltaX < -25) {
            isLeft = true;
          } else if (deltaX > 25) {
            isRight = true;
          }
        }
      }

      // Movement execution
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

      // Double Jump detection (Keyboard JustDown + Touch Jump)
      const justJump =
        Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
        Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
        Phaser.Input.Keyboard.JustDown(this.wasd.space) ||
        touchInputsRef.current.jump;

      if (touchInputsRef.current.jump) {
        touchInputsRef.current.jump = false;
      }

      if (justJump) {
        if (this.player.body.touching.down) {
          jumpCount = 1;
          this.player.setVelocityY(-550);
          soundEffects.playJump();
        } else if (jumpCount === 1) {
          jumpCount = 2;
          this.player.setVelocityY(-480);
          soundEffects.playJump();

          // Sparkle text for double jump
          const djBadge = this.add.text(this.player.x - 24, this.player.y - 20, "🦘 2x", {
            fontSize: "16px",
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            fontStyle: "bold",
            fill: "#C084FC",
            stroke: "#000000",
            strokeThickness: 3,
          });
          this.tweens.add({
            targets: djBadge,
            y: this.player.y - 50,
            alpha: 0,
            duration: 600,
            onComplete: () => djBadge.destroy(),
          });
        }
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

      {/* Pause Button in top bar */}
      {gameStarted && !gameOverData && (
        <button
          onClick={togglePause}
          title="Pause Game (P or Esc)"
          style={{
            position: "absolute",
            top: "20px",
            right: "130px",
            background: "rgba(17, 24, 39, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "999px",
            padding: "8px 16px",
            color: "#E5E7EB",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 50,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(168, 85, 247, 0.35)";
            e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(17, 24, 39, 0.8)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <span>⏸️</span>
          <span>Pause</span>
        </button>
      )}

      <PauseModal
        isOpen={isPaused}
        onResume={togglePause}
        onRestart={restartGame}
        onMenu={returnToMenu}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <TouchControls
        active={gameStarted}
        onMove={handleTouchMove}
        onJump={handleTouchJump}
      />

      {!gameStarted && (
        <StartScreen
          highScore={highScore}
          onStart={() => setGameStarted(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
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
