import { Injectable } from '@angular/core';
import seedrandom from 'seedrandom';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  getSeededRandomBetween(min: number, max: number, seed: string) {
    let n = seedrandom(seed);
    return Math.floor(n() * (max - min + 1) + min);
  }

  seedShuffle(_array: any[], seed: string) {
    let array = [..._array];
    let rng = seedrandom(seed);
    let m = array.length,
      t,
      i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(rng() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
}
