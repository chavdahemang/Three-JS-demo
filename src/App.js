import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useProgress } from "@react-three/drei";
import { Suspense, useState } from "react";

import Character from "./components/character/Character";
import ColorSwatch, { SHIRT_COLORS, PANTS_COLORS } from "./components/ui/ColorSwatch";
import "./App.css";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="loader-wrap">
        <div className="loader-spinner" />
        <span className="loader-text">Loading {Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

const ANIMATIONS = [
  { name: "default", label: "Default", icon: "🧍" },
  { name: "breathing", label: "Breathing", icon: "🫁" },
  { name: "dance", label: "Dancing", icon: "🕺" },
  { name: "dance2", label: "Dance 2", icon: "🕺" },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("shirt"); // "shirt" | "pants"
  const [shirtColor, setShirtColor] = useState(SHIRT_COLORS[0].hex);
  const [pantsColor, setPantsColor] = useState(PANTS_COLORS[0].hex);
  const [playMusic,setPlayMusic] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState("breathing");

  const currentColors = activeCategory === "shirt" ? SHIRT_COLORS : PANTS_COLORS;
  const currentColor = activeCategory === "shirt" ? shirtColor : pantsColor;
  const activeColorObj = currentColors.find((c) => c.hex === currentColor);

  const handleColorChange = (hex) => {
    if (activeCategory === "shirt") {
      setShirtColor(hex);
    } else {
      setPantsColor(hex);
    }
  };

  const handleRandomize = () => {
    const randomShirt = SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)].hex;
    const randomPants = PANTS_COLORS[Math.floor(Math.random() * PANTS_COLORS.length)].hex;
    setShirtColor(randomShirt);
    setPantsColor(randomPants);
  };

  const handlePlayMusic = ()=>{
    setPlayMusic(!playMusic)
  }
  return (
    <div className="app-root">

      <Canvas
        shadows
        camera={{ position: [0, 1.0, 4.5], fov: 50 }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow />

        <Suspense fallback={<Loader />}>
          <Character
            shirtColor={shirtColor}
            pantsColor={pantsColor}
            activeAnimation={activeAnimation}
            playMusic={playMusic}
          />
        </Suspense>

        <Environment preset="city" />

        <OrbitControls
          target={[0, 0.85, 0]}
          enableDamping
          dampingFactor={0.07}
          minDistance={2.5}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      <div className="color-panel">

        <div className="category-tabs">
          <button
            className={`category-tab ${activeCategory === "shirt" ? "category-tab--active" : ""}`}
            onClick={() => setActiveCategory("shirt")}
          >
            <span>👕</span>
            <span>T-Shirt</span>
            <span
              className="category-tab__pip"
              style={{ background: shirtColor }}
            />
          </button>

          <button
            className={`category-tab ${activeCategory === "pants" ? "category-tab--active" : ""}`}
            onClick={() => setActiveCategory("pants")}
          >
            <span>👖</span>
            <span>Pants</span>
            <span
              className="category-tab__pip"
              style={{ background: pantsColor }}
            />
          </button>
        </div>

        <div className="color-panel__divider" />

        <div className="color-panel__header">
          <div
            className="color-panel__dot"
            style={{ background: currentColor }}
          />
          <div>
            <p className="color-panel__title">
              {activeCategory === "shirt" ? "T-Shirt Color" : "Pants Color"}
            </p>
            <p className="color-panel__sub">{activeColorObj?.name ?? "Custom"}</p>
          </div>
        </div>

        <div className="color-panel__divider" />

        <div className="swatch-grid">
          {currentColors.map((color) => (
            <ColorSwatch
              key={color.hex}
              color={color}
              isActive={currentColor === color.hex}
              onClick={() => handleColorChange(color.hex)}
            />
          ))}
        </div>

        <button className="randomize-btn" onClick={handleRandomize}>
          <span>🎲</span>
          <span>Randomize Outfit</span>
        </button>
        <button className="randomize-btn" onClick={()=>handlePlayMusic()}>
          {/* <span></span> */}
          <span>Play music</span>
        </button>

        <p className="color-panel__hint">🖱 Drag to rotate · Scroll to zoom</p>
      </div>

      <div className="anim-panel">
        <p className="anim-panel__title">Animation</p>
        <div className="color-panel__divider" />
        <div className="anim-panel__list">
          {ANIMATIONS.map((anim) => (
            <button
              key={anim.name}
              className={`anim-btn ${activeAnimation === anim.name ? "anim-btn--active" : ""}`}
              onClick={() => setActiveAnimation(anim.name)}
            >
              <span>{anim.icon}</span>
              {anim.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}