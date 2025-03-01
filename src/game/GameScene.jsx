import  { useEffect } from 'react';
import Phaser from 'phaser';

const GameScene = () => {
  useEffect(() => {
    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    let score = 0;
    let scoreText;

    function preload() {
      this.load.image('sky', 'assets/sky.png');
      this.load.image('ground', 'assets/platform.png');
      this.load.image('star', 'assets/star.png');
      this.load.image('bomb', 'assets/bomb.png');
      this.load.spritesheet('dude', 'assets/dude.png', {
        frameWidth: 32,
        frameHeight: 48,
      });
    }

    function create() {
      this.add.image(400, 300, 'sky');

      // Platforms
      this.platforms = this.physics.add.staticGroup();
      this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
      this.platforms.create(600, 400, 'ground');
      this.platforms.create(50, 250, 'ground');
      this.platforms.create(750, 220, 'ground');

      // Player setup
      this.player = this.physics.add.sprite(100, 450, 'dude');
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.player.body.setGravityY(300);
      this.physics.add.collider(this.player, this.platforms);

      // Animations
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20,
      });

      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      // Stars
      this.stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });

      this.physics.add.collider(this.stars, this.platforms);
      this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

      // Keyboard input
      this.cursors = this.input.keyboard.createCursorKeys();

      // Score text
      scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#000',
      });
    }

    function collectStar(player, star) {
      star.disableBody(true, true);
      score += 10;
      scoreText.setText('Score: ' + score);
    }

    function update() {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
      }

      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
      }
    }

    // Initialize the Phaser game
    const game = new Phaser.Game(config);

   
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
};

export default GameScene;
