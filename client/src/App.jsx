import React, { useState, useRef, useEffect } from "react";
import Canvas from "./Canvas";
import ControlPanel from "./ControlPanel";
import "./App.css";

export default function App() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState(null);
  const [hasCentered, setHasCentered] = useState(false);

  const scaleRef = useRef(scale);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  // Center once canvasSize is available and we have not centered yet
  useEffect(() => {
    if (canvasSize && !hasCentered) {
      setOffset({ x: canvasSize.width / 2, y: canvasSize.height / 2 });
      setHasCentered(true);
    }
  }, [canvasSize, hasCentered]);

  const centerOffset = () => {
    if (canvasSize) {
      setOffset({ x: canvasSize.width / 2, y: canvasSize.height / 2 });
    }
  };

  const topLeftOffset = () => {
    if (canvasSize) {
      setOffset({ x: 0, y: 0 });
    }
  };

  const resetScale = (factor = 0) => {
    if (factor === 0) {
      setScale(1);
    } else {
      setScale(scale * factor);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Edit2D</h1>
      </div>

      <div className="main">
        <div className="canvas-container">
          <Canvas
            offset={offset}
            setOffset={setOffset}
            scale={scale}
            setScale={setScale}
            scaleRef={scaleRef}
            setCanvasSize={setCanvasSize}
          />
        </div>

        <div className="control-panel-container">
          <ControlPanel
            offset={offset}
            scale={scale}
            setOffset={setOffset}
            setScale={setScale}
            centerOffset={centerOffset}
            topLeftOffset={topLeftOffset}
            resetScale={resetScale}
          />
        </div>
      </div>
    </div>
  );
}
