import { useProgress } from "@react-three/drei";
import { useState, useEffect } from "react";

export default function Loader() {
  const { active, progress } = useProgress();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  
  if ((!active || progress === 100) && minTimeElapsed) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "20px", fontWeight: "bold" }}>
        Loading World...
      </div>
      <div
        style={{
          width: "300px",
          height: "10px",
          background: "#333",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#4ade80", // Tailwind green-400
            transition: "width 0.2s ease-in-out",
          }}
        />
      </div>
      <div style={{ marginTop: "10px", color: "#888" }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}
