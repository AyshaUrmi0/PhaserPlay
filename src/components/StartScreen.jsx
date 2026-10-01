/* eslint-disable react/prop-types */
import GameButton from "../config/GameButton";

const StartScreen = ({ highScore, onStart, onOpenLeaderboard }) => {
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
        <button
          onClick={onOpenLeaderboard}
          title="Click to view Top Runs Leaderboard"
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(251, 191, 36, 0.35)",
            padding: "8px 22px",
            borderRadius: "999px",
            color: "#FBBF24",
            fontSize: "17px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.35)";
          }}
        >
          <span>🏆 Best: {highScore}</span>
          <span style={{ fontSize: "12px", opacity: 0.75, borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: "8px" }}>
            Leaderboard 📊
          </span>
        </button>
      </div>

      <GameButton onClick={onStart} />

      {/* Controls Instruction Chips */}
      <div
        style={{
          position: "absolute",
          bottom: "7%",
          background: "rgba(17, 24, 39, 0.9)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "14px",
          padding: "14px 26px",
          color: "#E5E7EB",
          fontSize: "14px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          🖱️ <strong>Mouse:</strong> Move cursor to guide |{" "}
          <strong style={{ color: "#A855F7" }}>Click</strong> to Jump
        </span>
        <span style={{ opacity: 0.35 }}>|</span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          ⌨️ <strong>Keys:</strong> <strong style={{ color: "#A855F7" }}>← →</strong> /{" "}
          <strong style={{ color: "#A855F7" }}>A D</strong> to move |{" "}
          <strong style={{ color: "#A855F7" }}>↑ / W / Space</strong> to jump (🦘 Double Jump!)
        </span>
      </div>
    </div>
  );
};

export default StartScreen;
