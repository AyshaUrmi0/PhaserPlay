import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GameScene } from "../game/GameScene";

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth, 
      height: window.innerHeight, 
      parent: gameRef.current,
      physics: { default: "matter", matter: { gravity: { y: 1 } } },
      scene: [GameScene],
      scale: {
        mode: Phaser.Scale.RESIZE, 
        autoCenter: Phaser.Scale.CENTER_BOTH, 
      },
    });

    return () => {
      phaserGame.destroy(true);
    };
  }, []);

  return <div ref={gameRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default Game;
