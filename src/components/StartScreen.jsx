/* eslint-disable react/prop-types */
import GameButton from "../config/GameButton";

const StartScreen = ({ highScore, onStart }) => {
  return (
    <div
      style={{
        backgroundImage: "url('/assets/sky.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Header & High Score */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <h1
          style={{
            color: "#FFFFFF",
            fontSize: "48px",
            fontWeight: "900",
            textShadow:
              "0 4px 12px rgba(0,0,0,0.6), 0 0 20px rgba(168, 85, 247, 0.4)",
            letterSpacing: "2px",
            margin: 0,
          }}
        >
          🕹️ PHASER PLAY
        </h1>
        <div
          style={{
            background: "rgba(17, 24, 39, 0.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "8px 20px",
            borderRadius: "999px",
            color: "#FBBF24",
            fontSize: "18px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          🏆 High Score: {highScore}
        </div>
      </div>

      <GameButton onClick={onStart} />

      {/* Controls Instruction Chips */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          background: "rgba(17, 24, 39, 0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "12px 24px",
          color: "#E5E7EB",
          fontSize: "14px",
          display: "flex",
          gap: "16px",
          alignItems: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        <span>
          Move: <strong style={{ color: "#A855F7" }}>← →</strong> or{" "}
          <strong style={{ color: "#A855F7" }}>A / D</strong>
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span>
          Jump: <strong style={{ color: "#A855F7" }}>↑</strong> or{" "}
          <strong style={{ color: "#A855F7" }}>W</strong> or{" "}
          <strong style={{ color: "#A855F7" }}>Space</strong>
        </span>
      </div>
    </div>
  );
};

export default StartScreen;
