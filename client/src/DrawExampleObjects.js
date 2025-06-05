export default class DrawExampleObjects {
    constructor() {}
  
    drawBaseObjects(p5) {
      // Draw origin
      p5.fill(255, 0, 0);
      p5.noStroke();
      p5.ellipse(30, 30, 20, 20);
  
      // Example objects
      p5.fill(0, 0, 255, 150);
      p5.rect(50, 50, 100, 100);
  
      p5.fill(0, 64, 128, 150);
      p5.rect(50, 50, 200, 200);
  
      p5.fill(0, 128, 255, 150);
      p5.rect(50, 50, 300, 300);
    }
  
    drawBaseObjects2(p5) {
      for (let i = 0; i < 500*15; i++) {
        const seed = i + 1;
        const x = (seed * 73) % 1000;
        const y = (seed * 151) % 1000;
        const size = 5 + (seed * 37) % 40; // small sizes: 5–14
    
        const r = (seed * 23) % 256;
        const g = (seed * 47) % 256;
        const b = (seed * 89) % 256;
        const a = 80 + (seed * 53) % 100; // opacity 80–179
    
        const shapeType = seed % 3; // 0 = rect, 1 = ellipse, 2 = triangle
    
        p5.fill(r, g, b, a);
        p5.noStroke();
    
        if (shapeType === 0) {
          p5.rect(x, y, size, size);
        } else if (shapeType === 1) {
          p5.ellipse(x, y, size, size);
        } else {
          p5.triangle(
            x, y,
            x + size, y + size / 2,
            x, y + size
          );
        }
      }
    }
    

    drawRandomRects(p5, count) {
      for (let i = 0; i < count; i++) {
        const x = p5.random(0, p5.width);
        const y = p5.random(0, p5.height);
        const w = p5.random(20, 100);
        const h = p5.random(20, 100);
        p5.fill(p5.random(255), p5.random(255), p5.random(255), 150);
        p5.noStroke();
        p5.rect(x, y, w, h);
      }
    }
  
    drawRandomCircles(p5, count) {
      for (let i = 0; i < count; i++) {
        const x = p5.random(0, p5.width);
        const y = p5.random(0, p5.height);
        const r = p5.random(10, 60);
        p5.noFill();
        p5.stroke(p5.random(255), p5.random(255), p5.random(255));
        p5.strokeWeight(2);
        p5.ellipse(x, y, r, r);
      }
    }
  
    drawRandomLines(p5, count) {
      for (let i = 0; i < count; i++) {
        const x1 = p5.random(0, p5.width);
        const y1 = p5.random(0, p5.height);
        const x2 = p5.random(0, p5.width);
        const y2 = p5.random(0, p5.height);
        p5.stroke(p5.random(255), p5.random(255), p5.random(255));
        p5.strokeWeight(p5.random(1, 4));
        p5.line(x1, y1, x2, y2);
      }
    }
  
    drawRandomTriangles(p5, count) {
      for (let i = 0; i < count; i++) {
        const x1 = p5.random(p5.width);
        const y1 = p5.random(p5.height);
        const x2 = x1 + p5.random(-50, 50);
        const y2 = y1 + p5.random(-50, 50);
        const x3 = x1 + p5.random(-50, 50);
        const y3 = y1 + p5.random(-50, 50);
        p5.fill(p5.random(255), p5.random(255), p5.random(255), 120);
        p5.noStroke();
        p5.triangle(x1, y1, x2, y2, x3, y3);
      }
    }
  
    drawRandomGradientEllipses(p5, count) {
      for (let i = 0; i < count; i++) {
        const x = p5.random(p5.width);
        const y = p5.random(p5.height);
        const w = p5.random(40, 100);
        const h = p5.random(40, 100);
        const r = p5.random(255);
        const g = p5.random(255);
        const b = p5.random(255);
        p5.fill(r, g, b, 100);
        p5.stroke(r / 2, g / 2, b / 2);
        p5.strokeWeight(2);
        p5.ellipse(x, y, w, h);
      }
    }
  }
  