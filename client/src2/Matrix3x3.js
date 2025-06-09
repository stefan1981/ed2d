// Matrix3x3.js
export default class Matrix3x3 {
    constructor() {
      this.reset();
    }
  
    reset() {
      this.m = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
    }
  
    multiply(other) {
      const result = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
  
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let k = 0; k < 3; k++) {
            sum += this.m[r][k] * other.m[k][c];
          }
          result[r][c] = sum;
        }
      }
      this.m = result;
    }
      multiplyWith(other) {
        const result = new Matrix3x3();
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            result.m[r][c] = 0;
            for (let k = 0; k < 3; k++) {
              result.m[r][c] += this.m[r][k] * other.m[k][c];
            }
          }
        }
        return result;
      }  
    translate(x, y) {
      const translation = new Matrix3x3();
      translation.m[0][2] = x;
      translation.m[1][2] = y;
      this.multiply(translation);
    }
  
    scale(sx, sy) {
      const scaling = new Matrix3x3();
      scaling.m[0][0] = sx;
      scaling.m[1][1] = sy;
      this.multiply(scaling);
    }
  
    rotate(rad) {
      const rotation = new Matrix3x3();
      const c = Math.cos(rad);
      const s = Math.sin(rad);
      rotation.m[0][0] = c;
      rotation.m[0][1] = -s;
      rotation.m[1][0] = s;
      rotation.m[1][1] = c;
      this.multiply(rotation);
    }

    transformPoint(x, y) {
        const m = this.m;
        const newX = m[0][0] * x + m[0][1] * y + m[0][2];
        const newY = m[1][0] * x + m[1][1] * y + m[1][2];
        return { x: newX, y: newY };
      }
    inverse() {
    const m = this.m;
    const a = m[0][0], c = m[0][1], tx = m[0][2];
    const b = m[1][0], d = m[1][1], ty = m[1][2];
    
    const det = a * d - b * c;
    
    if (det === 0) {
        throw new Error("Matrix not invertible");
    }
    
    const invDet = 1 / det;
    
    const invA =  d * invDet;
    const invB = -b * invDet;
    const invC = -c * invDet;
    const invD =  a * invDet;
    
    const invTx = -(invA * tx + invC * ty);
    const invTy = -(invB * tx + invD * ty);
    
    const inverseMatrix = new Matrix3x3();
    inverseMatrix.m = [
        [invA, invC, invTx],
        [invB, invD, invTy],
        [0,    0,    1]
    ];
    
    return inverseMatrix;
    }

    applyToPoint(x, y) {
      const nx = x * this.m[0][0] + y * this.m[0][1] + this.m[0][2];
      const ny = x * this.m[1][0] + y * this.m[1][1] + this.m[1][2];
      return { x: nx, y: ny };
    }
  }
  