import { Map2D } from '../data/map';
import { PRNG } from './prng';
export class Automaton {
  private seed: number | string = new Date().getTime();
  private step = 0;
  private probability: number = 0.7;
  private birth: Array<number> = [6, 7, 8];
  private survival: Array<number> = [5, 6, 7, 8];
  private map: Map2D<boolean>;
  private random: PRNG;
  constructor (private x: number = 50, private y: number = 50, options?: AutomatonOptions) {

    if (options) {
      if (options.seed) this.seed = options.seed;
      if (options.probability) this.probability = options.probability;
      if (options.birth) this.birth = options.birth;
      if (options.survival) this.survival = options.survival;
    }

    this.random = new PRNG(this.seed);

    // create automaton map
    this.map = new Map2D<boolean>(this.x, this.y);
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        // randomly choose alive/dead
        let rand = this.random.next();
        let alive = rand < this.probability;
        this.map.set(x, y, alive);
      }
    }

    // do initial iterations
    if (options && options.step) {
      for (let i = 0; i < options.step; i++) {
        this.next();
      }
    }
  }
  next () {
    let nextMap = new Map2D<boolean>(this.x, this.y);

    // Loop over each row and column of the map
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
          let neighboursCount = this.countNeighbours(x, y);

          // If the cell is alive, see if it is NOT surrounded by any of the integers in the survival list
          if (x === 0 || y === 0 || x === this.x - 1 || y === this.y - 1) {
            // do nothing, keep eadge tiles dead
            nextMap.set(x, y, false);
          } else if (this.map.get(x, y)) {
              if (!(this.survival.indexOf(neighboursCount) > -1)) {
                nextMap.set(x, y, false);
              } else {
                nextMap.set(x, y, true);
              }
          } else {  // if the cell is dead, see if it is surrounded by any of the integers in the birth list
              if (this.birth.indexOf(neighboursCount) > -1) {
                nextMap.set(x, y, true);
              } else {
                nextMap.set(x, y, false);
              }
          }
      }
    }
    // copy nextMap to map
    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        this.map.set(x, y, nextMap.get(x, y));
      }
    }
    this.step++;
  }
  countNeighbours (cellX: number, cellY: number): number {
    let count = 0;
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
          let neighbourX = cellX + x;
          let neighbourY = cellY + y;
          if (x == 0 && y == 0) {
            // this is the current cell
          } else if (neighbourX < 0 || neighbourY < 0 || neighbourX >= this.x - 1 || neighbourY >= this.y - 1) {
            // Count out of bounds tiles as dead
            count--;
          } else if (this.map.get(neighbourX, neighbourY)) {
            // Otherwise, a normal check of the neighbour
            count++;
          }
      }
    }
    return count;
  }
  getMap () {
    return this.map;
  }
}


interface AutomatonOptions {
  seed?: number | string;
  step?: number;
  probability?: number;
  birth?: Array<number>;
  survival?: Array<number>;
}