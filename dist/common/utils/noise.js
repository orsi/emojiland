"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class Noise {
    constructor(frequency, amplitude, octaves, persistence) {
        this.samples = [];
        this.frequency = frequency;
        this.amplitude = amplitude;
        this.octaves = octaves ? octaves : 1;
        this.persistence = persistence ? persistence : 1;
    }
    noise1d(x) {
        let point = x / this.frequency;
        let previousPoint = Math.floor(point);
        let nextPoint = Math.ceil(point);
        let previousPointValue = this.get1dValue(previousPoint);
        let nextPointValue = this.get1dValue(nextPoint);
        let distance = point - previousPoint;
        let result = previousPointValue * (1 - distance) + nextPointValue * (distance);
        return result;
    }
    get1dValue(x) {
        let value = this.samples[x];
        // cache value if not available
        if (!value) {
            let prng = new _1.PRNG(x);
            value = prng.range(0, this.amplitude);
            this.samples[x] = value;
        }
        return value;
    }
    noise2d(x, y) {
        let xLocation = x / this.frequency;
        let yLocation = y / this.frequency;
        let xLeftLocation = Math.floor(xLocation);
        let xRightLocation = Math.ceil(xLocation);
        let yTopLocation = Math.floor(yLocation);
        let yBottomLocation = Math.ceil(yLocation);
        let topLeftValue = this.get2dValue(xLeftLocation, yTopLocation);
        let topRightValue = this.get2dValue(xRightLocation, yTopLocation);
        let bottomLeftValue = this.get2dValue(xLeftLocation, yBottomLocation);
        let bottomRightValue = this.get2dValue(xRightLocation, yBottomLocation);
        let xDistance = xLocation - xLeftLocation;
        let yDistance = yLocation - yTopLocation;
        // how much does each corner influence the value
        let topLeftInfluence = topLeftValue * ((1 - xDistance) * (1 - yDistance));
        let topRightInfluence = topRightValue * ((xDistance) * (1 - yDistance));
        let bottomLeftInfluence = bottomLeftValue * ((1 - xDistance) * (yDistance));
        let bottomRightInfluence = bottomRightValue * ((xDistance) * (yDistance));
        let result = topLeftInfluence + topRightInfluence + bottomLeftInfluence + bottomRightInfluence;
        return result;
    }
    get2dValue(x, y) {
        let xValue = this.samples[x];
        if (!xValue) {
            // cache value if not available
            let xRandom = new _1.PRNG(x);
            xValue = this.samples[x] = xRandom.range(0, this.amplitude);
        }
        let yValue = this.samples[y];
        if (!yValue) {
            // cache value if not available
            let yRandom = new _1.PRNG(y);
            yValue = this.samples[y] = yRandom.range(0, this.amplitude);
        }
        let value = (xValue + yValue) * 0.5;
        return value;
    }
}
exports.Noise = Noise;
//# sourceMappingURL=noise.js.map