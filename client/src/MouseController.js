// MouseController.js
export default class MouseController {
  constructor({ offsetRef, transformRef, scale, setOffset, setScale }) {
    this.offsetRef = offsetRef;
    this.transformRef = transformRef;
    this.scale = scale; // als Wert
    this.setOffset = setOffset;
    this.setScale = setScale;
  
    this.isDraggingRef = { current: false };
    this.lastMouseRef = { current: { x: 0, y: 0 } };
  }
  
  setScaleValue(scale) {
    this.scale = scale;
  }

    updateTransform() {
      const m = this.transformRef.current;
      m.reset();

      m.translate(this.offsetRef.current.x, this.offsetRef.current.y);
      
      m.scale(this.scale, this.scale);
    }

    mousePressed(p5) {
      if (p5.mouseX < p5.width) {
        this.isDraggingRef.current = true;
        this.lastMouseRef.current = { x: p5.mouseX, y: p5.mouseY };
      }
    }
  
    mouseReleased() {
      this.isDraggingRef.current = false;
    }
  
    mouseDragged(p5) {
      if (this.isDraggingRef.current) {
        const dx = p5.mouseX - this.lastMouseRef.current.x;
        const dy = p5.mouseY - this.lastMouseRef.current.y;
        this.offsetRef.current.x += dx;
        this.offsetRef.current.y += dy;
        this.lastMouseRef.current = { x: p5.mouseX, y: p5.mouseY };
        this.updateTransform();
  
        if (this.setOffset) this.setOffset({ ...this.offsetRef.current });
      }
    }
  
    
    mouseWheel(p5, event) {
        const zoomSpeed = 1.0003; // Je größer, desto schneller der Zoom
        if (event.delta > 0) {
          // reinzoomen (verkleinern)
          this.scale /= Math.pow(zoomSpeed, event.delta);
        } else {
          // rauszoomen (vergrößern)
          this.scale *= Math.pow(zoomSpeed, -event.delta);
        }
      
        // Minimum- und Maximum-Scale (z.B. 0.1 bis 10)
        //this.scaleRef.current = Math.min(Math.max(this.scaleRef.current, 0.1), 10);
      
        this.updateTransform();
      
        if (this.setScale) this.setScale(this.scale);
      
        return false;
    }

  }
  