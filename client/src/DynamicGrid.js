export default class DynamicGrid {
    constructor(gridSize = 50) {
      this.baseGridSize = gridSize;
    }
  
    getAdjustedGridSize(scale, minPx = 40, maxPx = 640, baseSize = 10) {
        // Logarithmische Mittelgröße
        const idealWorldSize = Math.sqrt((minPx / scale) * (maxPx / scale));
      
        // Berechne, welches exponentielle Level dem am nächsten kommt
        const level = Math.round(Math.log2(idealWorldSize / baseSize));
      
        // Errechne tatsächliche gridSize aus level
        return baseSize * Math.pow(2, level);
      }


      drawGrid(p5, transformMatrix) {
        const scaleX = transformMatrix.m[0][0];
        const scaleY = transformMatrix.m[1][1];
        const gridSize = this.getAdjustedGridSize(scaleX/0.9, 40, 800, this.baseGridSize);
        const subDivisions = 10;
        const subGridSize = gridSize / subDivisions;
      
        const inverse = transformMatrix.inverse();
        const topLeft = inverse.transformPoint(0, 0);
        const bottomRight = inverse.transformPoint(p5.width, p5.height);
      
        const minX = Math.floor(topLeft.x / gridSize) * gridSize;
        const maxX = Math.ceil(bottomRight.x / gridSize) * gridSize;
        const minY = Math.floor(topLeft.y / gridSize) * gridSize;
        const maxY = Math.ceil(bottomRight.y / gridSize) * gridSize;
      
        // 🟠 1. Feines Grid zeichnen
        p5.stroke('#ddd'); // hellere Farbe
        p5.strokeWeight(0.5 / scaleX);
        for (let x = minX; x <= maxX; x += subGridSize) {
          if (Math.round(x / gridSize * subDivisions) % subDivisions !== 0) {
            p5.line(x, minY, x, maxY);
          }
        }
        for (let y = minY; y <= maxY; y += subGridSize) {
          if (Math.round(y / gridSize * subDivisions) % subDivisions !== 0) {
            p5.line(minX, y, maxX, y);
          }
        }
      
        // 🔵 2. Grobes Hauptgrid
        p5.stroke('#333');
        p5.strokeWeight(1 / scaleX);
        for (let x = minX; x <= maxX; x += gridSize) {
          p5.line(x, minY, x, maxY);
        }
        for (let y = minY; y <= maxY; y += gridSize) {
          p5.line(minX, y, maxX, y);
        }
      
        // Achsen
        this.drawAxesSide(p5, transformMatrix, gridSize, scaleX);
        this.drawAxes(p5, transformMatrix, gridSize, scaleX);
      }

      drawAxesSide(p5, transformMatrix, gridSize, scaleX) {
        const inverse = transformMatrix.inverse();
        const topLeft = inverse.transformPoint(0, 0);
        const bottomRight = inverse.transformPoint(p5.width, p5.height);
      
        const minX = Math.floor(topLeft.x / gridSize) * gridSize;
        const maxX = Math.ceil(bottomRight.x / gridSize) * gridSize;
        const minY = Math.floor(topLeft.y / gridSize) * gridSize;
        const maxY = Math.ceil(bottomRight.y / gridSize) * gridSize;
      
        // Draw thick axis lines (in world space)
        p5.stroke(150, 0, 0);
        p5.strokeWeight(3 / scaleX); // scaled by world zoom
        if (minX <= 0 && maxX >= 0) {
          p5.line(0, minY, 0, maxY);
        }
        if (minY <= 0 && maxY >= 0) {
          p5.line(minX, 0, maxX, 0);
        }
      
        // Draw labels in screen space, sticking to canvas borders
        p5.push();
        p5.resetMatrix(); // cancel world transform
        p5.noStroke();
        p5.fill('#000000');
        p5.textSize(12);
        p5.textAlign(p5.LEFT, p5.CENTER);
      
        // Y-axis labels on left canvas edge
        for (let y = minY; y <= maxY; y += gridSize) {
          if (Math.abs(y) > 1e-6) {
            const screen = transformMatrix.transformPoint(0, y);
            if (screen.y >= 0 && screen.y <= p5.height) {
              p5.text(this.formNumber(y), 5, screen.y+8);
            }
          }
        }
      
        // X-axis labels on top canvas edge
        p5.textAlign(p5.CENTER, p5.TOP);
        for (let x = minX; x <= maxX; x += gridSize) {
          if (Math.abs(x) > 1e-6) {
            const screen = transformMatrix.transformPoint(x, 0);
            if (screen.x >= 0 && screen.x <= p5.width) {
              p5.text(this.formNumber(x), screen.x, 5);
            }
          }
        }
      
        p5.pop();
      }

      drawAxes(p5, transformMatrix, gridSize, scaleX) {
        const inverse = transformMatrix.inverse();
        const topLeft = inverse.transformPoint(0, 0);
        const bottomRight = inverse.transformPoint(p5.width, p5.height);
      
        const minX = Math.floor(topLeft.x / gridSize) * gridSize;
        const maxX = Math.ceil(bottomRight.x / gridSize) * gridSize;
        const minY = Math.floor(topLeft.y / gridSize) * gridSize;
        const maxY = Math.ceil(bottomRight.y / gridSize) * gridSize;
      
        // draw thick axis lines
        p5.stroke(150, 0, 0);
        p5.strokeWeight(3 / scaleX); // world-scaled lines
        if (minX <= 0 && maxX >= 0) {
          p5.line(0, minY, 0, maxY);
        }
        if (minY <= 0 && maxY >= 0) {
          p5.line(minX, 0, maxX, 0);
        }
      
        // draw labels in screen space
        p5.push();
        p5.resetMatrix(); // cancel all transforms
        p5.noStroke();    // no thick outline!
        p5.fill('#000000');
        p5.textSize(12); // fixed screen font
        p5.textAlign(p5.CENTER, p5.TOP);
      
        // draw labels for y-axis
        for (let y = minY; y <= maxY; y += gridSize) {
          if (Math.abs(y) > 1e-6) {
            const screen = transformMatrix.transformPoint(0, y);
            p5.text(this.formNumber(y), screen.x - 10, screen.y + 2);
          }
        }
      
        // draw labels for x-axis
        for (let x = minX; x <= maxX; x += gridSize) {
          if (Math.abs(x) > 1e-6) {
            const screen = transformMatrix.transformPoint(x, 0);
            p5.text(this.formNumber(x), screen.x, screen.y + 5);
          }
        }
        p5.pop();
      }

      formNumber(cm) {
        const absVal = Math.abs(cm);
      
        let value, unit;
      
        if (absVal < 0.1) {
          value = cm * 10; // to mm
          unit = "mm";
          value = value.toFixed(1);
        } else if (absVal < 100) {
          value = cm;
          unit = "cm";
          value = value.toFixed(1);
        } else if (absVal < 100000) {
          value = cm / 100; // to meters
          unit = "m";
          value = value.toFixed(2);
        } else {
          value = cm / 100000; // to km
          unit = "km";
          value = value.toFixed(3);
        }
      
        return `${value} ${unit}`;
      }

      
  }
  