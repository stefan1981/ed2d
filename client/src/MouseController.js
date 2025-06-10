export default class MouseController {
  constructor({ offsetRef, transformRef, scaleRef, setOffset, setScale }) {
    this.offsetRef = offsetRef;
    this.transformRef = transformRef;
    this.scaleRef = scaleRef;
    this.setOffset = setOffset;
    this.setScale = setScale;

    this.isDraggingRef = { current: false };
    this.lastMouseRef = { current: { x: 0, y: 0 } };
  }

  setScaleValue(scale) {
    if (this.scaleRef.current !== scale) {
      this.scaleRef.current = scale;
    }
  }

  updateTransform() {
    const m = this.transformRef.current;
    m.reset();

    // zuerst verschieben
    m.translate(this.offsetRef.current.x, this.offsetRef.current.y);

    // dann skalieren
    const scale = this.scaleRef.current;
    m.scale(scale, scale);
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

      if (this.setOffset) {
        this.setOffset({ ...this.offsetRef.current });
      }
    }
  }

  mouseWheel(p5, event) {
    const zoomSpeed = 1.0005;
  
    const oldScale = this.scaleRef.current;
    let newScale = oldScale;
  
    if (event.delta > 0) {
      newScale /= Math.pow(zoomSpeed, event.delta);
      //newScale += 0.01;
    } else {
      newScale *= Math.pow(zoomSpeed, -event.delta);
      //newScale -= 0.01;
    }
  
    // Clamp the scale to reasonable bounds
    //newScale = Math.min(Math.max(newScale, 0.01), 1600);
  
    // Mouse position in screen coordinates
    const mouseX = p5.mouseX;
    const mouseY = p5.mouseY;
  
    // Current offset
    const offset = this.offsetRef.current;
  
    // Calculate world coordinates of mouse before zoom
    const worldX = (mouseX - offset.x) / oldScale;
    const worldY = (mouseY - offset.y) / oldScale;
  
    // Calculate new offset so that zoom centers on mouse position
    const newOffsetX = mouseX - worldX * newScale;
    const newOffsetY = mouseY - worldY * newScale;
  
    // Update refs
    this.scaleRef.current = newScale;
    this.offsetRef.current.x = newOffsetX;
    this.offsetRef.current.y = newOffsetY;
  
    this.updateTransform();
  
    // Update React state
    if (this.setScale) this.setScale(newScale);
    if (this.setOffset) this.setOffset({ x: newOffsetX, y: newOffsetY });
  
    return false; // prevent page scroll
  }
  
}
