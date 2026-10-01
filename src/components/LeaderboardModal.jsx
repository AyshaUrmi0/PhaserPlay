/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const LeaderboardModal = ({ isOpen, onClose }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem("phaserplay_leaderboard");
        setScores(raw ? JSON.parse(raw) : []);
      } catch {
        setScores([]);
      }
    }
  }, [isOpen]);

  const clearLeaderboard = () => {
    localStorage.removeItem("phaserplay_leaderboard");
    setScores([]);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(8px)",
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
          padding: "32px 36px",
          width: "90%",
          maxWidth: "460px",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(168, 85, 247, 0.25)",
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        <div style={{ fontSize: "36px", marginBottom: "6px" }}>🏆</div>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "900",
            margin: "0 0 16px 0",
            letterSpacing: "1.5px",
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #C084FC 50%, #A855F7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 10px rgba(168, 85, 247, 0.5))",
            textTransform: "uppercase",
          }}
        >
          Top Runs Leaderboard
        </h2>

        {scores.length === 0 ? (
          <div
            style={{
              padding: "32px 16px",
              color: "#94A3B8",
              fontSize: "15px",
              background: "rgba(0, 0, 0, 0.25)",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            No runs recorded yet. Play a game to record your first score!
          </div>
        ) : (
          <div
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr 70px 70px",
                padding: "10px 14px",
                background: "rgba(255, 255, 255, 0.05)",
                fontSize: "12px",
                fontWeight: "700",
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <span>#</span>
              <span style={{ textAlign: "left" }}>Score</span>
              <span>Wave</span>
              <span>Stars</span>
            </div>

            {scores.map((entry, idx) => {
              const medal =
                idx === 0
                  ? "🥇"
                  : idx === 1
                  ? "🥈"
                  : idx === 2
                  ? "🥉"
                  : `${idx + 1}`;
              return (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr 70px 70px",
                    padding: "12px 14px",
                    alignItems: "center",
                    borderBottom:
                      idx < scores.length - 1
                        ? "1px solid rgba(255, 255, 255, 0.05)"
                        : "none",
                    background:
                      idx === 0 ? "rgba(168, 85, 247, 0.08)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{medal}</span>
                  <div style={{ textAlign: "left" }}>
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "800",
                        color: idx === 0 ? "#FBBF24" : "#FFFFFF",
                      }}
                    >
                      {entry.score}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "11px",
                        color: "#64748B",
                      }}
                    >
                      {entry.date}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#A855F7",
                    }}
                  >
                    🚩 {entry.wave || 1}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#FBBF24",
                    }}
                  >
                    ⭐ {entry.stars || 0}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              background: "linear-gradient(135deg, #A853FF, #6366F1)",
              border: "none",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: "700",
              padding: "12px 28px",
              cursor: "pointer",
              boxShadow: "0 8px 16px -4px rgba(168, 83, 255, 0.5)",
            }}
          >
            Close
          </button>

          {scores.length > 0 && (
            <button
              onClick={clearLeaderboard}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                color: "#64748B",
                fontSize: "13px",
                fontWeight: "600",
                padding: "12px 18px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#EF4444";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#64748B";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              }}
            >
              Clear Records
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
