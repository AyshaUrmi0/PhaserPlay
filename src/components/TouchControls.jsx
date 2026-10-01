/* eslint-disable react/prop-types */
import { useState } from "react";

const TouchControls = ({ onMove, onJump, active }) => {
  const [showControls, setShowControls] = useState(() => {
    return (
      "ontouchstart" in window ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
    );
  });

  if (!active) return null;

  return (
    <>
      {/* Toggle button on top bar */}
      <button
        onClick={() => setShowControls((prev) => !prev)}
        title={showControls ? "Hide Touch Buttons" : "Show Touch Buttons"}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
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
        <span>🎮</span>
        <span>{showControls ? "Touch: On" : "Touch: Off"}</span>
      </button>

      {/* On-Screen D-Pad & Jump Buttons */}
      {showControls && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "0",
            right: "0",
            padding: "0 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            zIndex: 40,
            pointerEvents: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          {/* Directional Buttons (Left / Right) */}
          <div style={{ display: "flex", gap: "16px", pointerEvents: "auto" }}>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                onMove("left", true);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                onMove("left", false);
              }}
              onPointerLeave={(e) => {
                e.preventDefault();
                onMove("left", false);
              }}
              style={buttonStyle}
            >
              ◀
            </button>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                onMove("right", true);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                onMove("right", false);
              }}
              onPointerLeave={(e) => {
                e.preventDefault();
                onMove("right", false);
              }}
              style={buttonStyle}
            >
              ▶
            </button>
          </div>

          {/* Jump Button (supports Double Jump) */}
          <div style={{ pointerEvents: "auto" }}>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                onJump();
              }}
              style={{
                ...buttonStyle,
                width: "72px",
                height: "72px",
                fontSize: "26px",
                background:
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.75), rgba(99, 102, 241, 0.75))",
                border: "2px solid rgba(168, 85, 247, 0.8)",
                boxShadow: "0 6px 20px rgba(168, 85, 247, 0.4)",
              }}
            >
              ▲
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const buttonStyle = {
  width: "62px",
  height: "62px",
  borderRadius: "50%",
  background: "rgba(17, 24, 39, 0.8)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  color: "#FFFFFF",
  fontSize: "20px",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
  touchAction: "none",
  WebkitTapHighlightColor: "transparent",
};

export default TouchControls;
