import React, { useRef } from "react";
import Sketch from "react-p5";
import Matrix3x3 from "./Matrix3x3";
import DynamicGrid from "./DynamicGrid";
import DrawBaseObjects from "./DrawExampleObjects";
import MouseController from "./MouseController";

export default function Canvas({ offset, setOffset, scale, setScale, scaleRef, setCanvasSize}) {
  const transformRef = useRef(new Matrix3x3());     // the transform Matrix
  const offsetRef = useRef({ x: 0, y: 0 });         // the offset in Pixels to the top-left corner
  //const scaleRef = useRef(1);                       // the current zoom factor 
  const hasNotifiedReady = useRef(false);
  const gridRef = useRef(new DynamicGrid());
  const drawBaseObjectsRef = useRef(new DrawBaseObjects());
  const mouseControllerRef = useRef(
    new MouseController({ offsetRef, transformRef, scaleRef, setOffset, setScale })
  );

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth * 0.8, p5.windowHeight - 60).parent(canvasParentRef);
    setCanvasSize({ width: p5.width, height: p5.height });

    console.log(`Canvas setup complete with: ${p5.width.toFixed(0)}x${p5.height.toFixed(0)} px`);
  };

  // Synchronisiere scale-Prop mit scaleRef
  React.useEffect(() => {
    if (scaleRef.current !== scale) {
      scaleRef.current = scale;

      // Und auch Transform-Matrix aktualisieren:
      transformRef.current.m[0][0] = scale;
      transformRef.current.m[1][1] = scale;
    }
  }, [scale]);

  // Synchronisiere offsetProp mit offsetRef, wenn offset sich ändert:
  React.useEffect(() => {
    if (
      offset.x !== offsetRef.current.x ||
      offset.y !== offsetRef.current.y
    ) {
      offsetRef.current = { ...offset };

      // Und auch transformRef anpassen, damit p5 die Translation nutzt:
      transformRef.current.m[0][2] = offset.x;
      transformRef.current.m[1][2] = offset.y;
    }
  }, [offset]);

  /**
   * p5 object draw function.
   * This function is called repeatedly to draw the canvas.
   * @param {*} p5 
   */
  const draw = (p5) => {
    p5.background(240);
    p5.push();
    mouseControllerRef.current.setScaleValue(scale); // neue Methode, um Wert zu setzen
    const m = transformRef.current.m;
    p5.applyMatrix(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
  
    gridRef.current.drawGrid(p5, transformRef.current);
    drawBaseObjectsRef.current.drawBaseObjects(p5);
    p5.pop();
  
    const currentOffset = offsetRef.current;
  
    setOffset(prev => {
      if (prev.x !== currentOffset.x || prev.y !== currentOffset.y) {
        return { ...currentOffset };
      }
      return prev; // keine Änderung, kein Re-Render
    });
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth * 0.8, p5.windowHeight - 60);
    setCanvasSize({ width: p5.width, height: p5.height });
    hasNotifiedReady.current = false; // re-center after resize
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mousePressed={(p5) => mouseControllerRef.current.mousePressed(p5)}
      mouseReleased={() => mouseControllerRef.current.mouseReleased()}
      mouseDragged={(p5) => mouseControllerRef.current.mouseDragged(p5)}
      mouseWheel={(p5, e) => mouseControllerRef.current.mouseWheel(p5, e)}
      windowResized={windowResized}
    />
  );
}
