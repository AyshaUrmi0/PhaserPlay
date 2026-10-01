/* eslint-disable react/prop-types */
import { useEffect } from "react";

const PauseModal = ({ isOpen, onResume, onRestart, onMenu }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        e.preventDefault();
        onResume();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onResume]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.8)",
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
          padding: "36px 40px",
          width: "90%",
          maxWidth: "380px",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(168, 85, 247, 0.25)",
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>⏸️</div>
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "900",
            margin: "0 0 20px 0",
            letterSpacing: "1.5px",
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #C084FC 50%, #A855F7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 10px rgba(168, 85, 247, 0.5))",
            textTransform: "uppercase",
          }}
        >
          Game Paused
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={onResume}
            style={{
              background: "linear-gradient(135deg, #A853FF, #6366F1)",
              border: "none",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: "700",
              padding: "14px",
              cursor: "pointer",
              boxShadow: "0 10px 20px -5px rgba(168, 83, 255, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            ▶️ Resume (P / Esc)
          </button>

          <button
            onClick={onRestart}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              color: "#E2E8F0",
              fontSize: "15px",
              fontWeight: "600",
              padding: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          >
            🔄 Restart Run
          </button>

          <button
            onClick={onMenu}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              color: "#94A3B8",
              fontSize: "14px",
              fontWeight: "600",
              padding: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94A3B8";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseModal;
