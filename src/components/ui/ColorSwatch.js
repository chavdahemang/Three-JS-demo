import { useState } from "react";

export const SHIRT_COLORS = [
  { name: "Crimson Red", hex: "#ef4444" },
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Amber Gold", hex: "#f59e0b" },
  { name: "Electric Violet", hex: "#8b5cf6" },
  { name: "Neon Coral", hex: "#f43f5e" },
  { name: "Pure White", hex: "#ffffff" },
  { name: "Jet Black", hex: "#18181b" },
];

export const PANTS_COLORS = [
  { name: "Classic Khaki", hex: "#c4a47c" },
  { name: "Denim Blue", hex: "#2c5282" },
  { name: "Olive Green", hex: "#4d5d3e" },
  { name: "Slate Dark", hex: "#334155" },
  { name: "Sand Beige", hex: "#e2d9c8" },
  { name: "Warm Rust", hex: "#9a3412" },
  { name: "Midnight Black", hex: "#18181b" },
  { name: "Heather Gray", hex: "#9ca3af" },
];

export default function ColorSwatch({ color, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);

  const boxShadow = isActive
    ? `0 0 0 3px white, 0 0 0 5px ${color.hex}, 0 6px 16px ${color.hex}66`
    : hovered
      ? `0 4px 12px ${color.hex}88`
      : "0 2px 6px rgba(0,0,0,0.15)";

  return (
    <button
      className={`swatch-btn ${isActive ? "swatch-btn--active" : ""} ${hovered ? "swatch-btn--hovered" : ""}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={color.name}
      style={{ boxShadow }}
    >
      <div
        className="swatch-circle"
        style={{ background: color.hex }}
      />
      <span className={`swatch-label ${isActive ? "swatch-label--active" : ""}`}>
        {color.name}
      </span>
      {isActive && <span className="swatch-check">✓</span>}
    </button>
  );
}
