import React, { useRef, useEffect } from "react";
import Sketch from "react-p5";
import Matrix3x3 from "./Matrix3x3";
import DynamicGrid from "./DynamicGrid";
import DrawBaseObjects from "./DrawExampleObjects";
import MouseController from "./MouseController";

export default function Canvas({ offset, setOffset, scale, setScale, scaleRef, setCanvasSize }) {
  const transformRef = useRef(new Matrix3x3());
  const offsetRef = useRef({ x: 0, y: 0 });
  const gridRef = useRef(new DynamicGrid());
  const drawBaseObjectsRef = useRef(new DrawBaseObjects());

  let xm = 0;

  // MouseController bekommt offsetRef, transformRef, scaleRef und setState Funktionen
  const mouseControllerRef = useRef(
    new MouseController({ offsetRef, transformRef, scaleRef, setOffset, setScale })
  );

  // Setup Canvas und Canvas-Größe setzen
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth * 0.8, p5.windowHeight - 60).parent(canvasParentRef);
    setCanvasSize({ width: p5.width, height: p5.height });
    console.log(`Canvas setup complete with: ${p5.width}x${p5.height}`);
  };

  // Synchronisiere offsetProp mit offsetRef und transformRef
  useEffect(() => {
    if (offset.x !== offsetRef.current.x || offset.y !== offsetRef.current.y) {
      offsetRef.current = { ...offset };
      const m = transformRef.current.m;
      m[0][2] = offset.x;
      m[1][2] = offset.y;
    }
  }, [offset]);

  // Synchronisiere scaleProp mit scaleRef und transformRef
  useEffect(() => {
    if (scaleRef.current !== scale) {
      scaleRef.current = scale;
      const m = transformRef.current.m;
      m[0][0] = scale;
      m[1][1] = scale;
    }
  }, [scale, scaleRef]);

  // Synchronisiere scale im MouseController (damit Zoom richtig funktioniert)
  useEffect(() => {
    mouseControllerRef.current.setScaleValue(scale);
  }, [scale]);


  const drawSpindleLine = (p5, x, y, sWidth, spindles) => {
    const sDiameter = 5.5;
    const sWidthHalf = sWidth / 2;
    for (let i = 0; i < spindles; i++) {
      p5.stroke(0);
      p5.strokeWeight(0.1);
      p5.fill(200, 200, 200);
      p5.rect(x + i * sWidth, y, sWidth, sWidth);
      p5.fill('#ffffff');
      p5.circle(x + i * sWidth + sWidthHalf, y+sWidthHalf, sDiameter);
    }
  }

  const drawMachine = (p5, x, y) =>{
    const machineWidth = 51.0;
    const nrOfSpindles = 720;
    const sWidth = 7.0;
    
    // head stock
    //p5.stroke(0);
    //p5.strokeWeight(0);
    p5.fill('#00868B');
    p5.rect(x+0, y+0, 73.5, machineWidth);
    p5.fill('#888888');    
    p5.rect(x+73.5, y+0, 20, machineWidth);

    // spindles
    p5.fill('#cccccc');
    p5.rect(x+93.5, y+0, (nrOfSpindles*sWidth), machineWidth);

    drawSpindleLine(p5, x+93.5, y+0, sWidth, nrOfSpindles);
    drawSpindleLine(p5, x+93.5, y+machineWidth-7, sWidth, nrOfSpindles);

    // end stock
    //p5.stroke(0);
    //p5.strokeWeight(0);
    p5.fill('#00868B');
    p5.rect(x+93.5+(nrOfSpindles*sWidth), y, (70+117+28.4+30.2), machineWidth);

  }

  // p5 draw loop
  const draw = (p5) => {
    p5.background(240);

    p5.noStroke()

    p5.push();
    const m = transformRef.current.m;
    p5.applyMatrix(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);

    //xm += 0.1; // Beispiel für eine Variable, die sich ändert
    xm += 100 * (p5.deltaTime / 1000);

    // mover
    p5.fill('#ff0000');
    p5.circle(0+xm, 100, 40);

    // maschines
    for (let i = 0; i < 15; i++) {
      drawMachine(p5, 0, i * 200);
    }

    // grid
    //gridRef.current.drawGrid(p5, transformRef.current);

    p5.pop();

    // Falls sich offset intern im MouseController ändert, update App-Offset
    // const currentOffset = offsetRef.current;
    // setOffset(prev => {
    //   if (prev.x !== currentOffset.x || prev.y !== currentOffset.y) {
    //     return { ...currentOffset };
    //   }
    //   return prev;
    // });
  };

  // Fenstergröße-Änderung behandeln
  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth * 0.8, p5.windowHeight - 60);
    setCanvasSize({ width: p5.width, height: p5.height });
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
