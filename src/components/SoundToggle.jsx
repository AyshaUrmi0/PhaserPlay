import { useState } from "react";
import { soundEffects } from "../utils/audio";

const SoundToggle = () => {
  const [muted, setMuted] = useState(() => soundEffects.isMuted());

  const handleToggle = () => {
    const nextState = soundEffects.toggleMute();
    setMuted(nextState);
  };

  return (
    <button
      onClick={handleToggle}
      title={muted ? "Unmute Sound" : "Mute Sound"}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
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
      <span>{muted ? "🔇" : "🔊"}</span>
      <span>{muted ? "Muted" : "Sound"}</span>
    </button>
  );
};

export default SoundToggle;
