/* eslint-disable react/prop-types */
import { useEffect } from "react";

const GameOverModal = ({ data, onRestart, onMenu }) => {
  // Quick restart with Space or Enter key
  useEffect(() => {
    if (!data) return;
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data, onRestart]);

  if (!data) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #1e293b, #0f172a)",
          border: "1px solid rgba(168, 85, 247, 0.35)",
          borderRadius: "20px",
          padding: "36px 40px",
          width: "90%",
          maxWidth: "420px",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(168, 85, 247, 0.25)",
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        {/* Game Over Title - Themed to match PhaserPlay Violet & Cyan Palette */}
        <div style={{ fontSize: "44px", marginBottom: "8px" }}>👾</div>
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "900",
            margin: "0 0 10px 0",
            letterSpacing: "2px",
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #C084FC 50%, #A855F7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 10px rgba(168, 85, 247, 0.6))",
            textTransform: "uppercase",
          }}
        >
          Game Over
        </h2>

        {/* New High Score Celebration Banner */}
        {data.isNewHigh && (
          <div
            style={{
              display: "inline-block",
              background:
                "linear-gradient(90deg, #F59E0B, #EC4899, #8B5CF6)",
              padding: "6px 16px",
              borderRadius: "999px",
              fontWeight: "800",
              fontSize: "14px",
              color: "#FFFFFF",
              marginBottom: "16px",
              boxShadow: "0 0 15px rgba(245, 158, 11, 0.5)",
              letterSpacing: "0.5px",
            }}
          >
            🎉 NEW HIGH SCORE! 🏆
          </div>
        )}

        {/* Score Summary Box */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.35)",
            borderRadius: "14px",
            padding: "18px 20px",
            margin: "16px 0 24px 0",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                color: "#94A3B8",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Score
            </div>
            <div
              style={{
                color: "#38BDF8",
                fontSize: "26px",
                fontWeight: "800",
              }}
            >
              {data.score}
            </div>
          </div>

          <div>
            <div
              style={{
                color: "#94A3B8",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Wave
            </div>
            <div
              style={{
                color: "#A855F7",
                fontSize: "26px",
                fontWeight: "800",
              }}
            >
              🚩 {data.wave || 1}
            </div>
          </div>

          <div>
            <div
              style={{
                color: "#94A3B8",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Stars
            </div>
            <div
              style={{
                color: "#FBBF24",
                fontSize: "26px",
                fontWeight: "800",
              }}
            >
              ⭐ {data.stars}
            </div>
          </div>

          <div
            style={{
              gridColumn: "span 3",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "#94A3B8",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              🏆 All-Time Best
            </span>
            <span
              style={{
                color: "#FBBF24",
                fontSize: "20px",
                fontWeight: "800",
              }}
            >
              {data.highScore}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={onRestart}
            style={{
              background: "linear-gradient(135deg, #A853FF, #6366F1)",
              border: "none",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "18px",
              fontWeight: "700",
              padding: "14px",
              cursor: "pointer",
              boxShadow: "0 10px 20px -5px rgba(168, 83, 255, 0.5)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            🔄 Play Again (Space / Enter)
          </button>

          <button
            onClick={onMenu}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              color: "#94A3B8",
              fontSize: "15px",
              fontWeight: "600",
              padding: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94A3B8";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
