import { Injectable } from '@angular/core';
import { timestamp } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { GameData } from 'src/app/types/game-data';

@Injectable({
  providedIn: 'root',
})
export class FindDifferenceService {
  constructor(private util: UtilService) {}
  getFindDifferencePlacements(
    elementPlacement: any,
    remainingElements: any[],
    data: GameData,
    userName: string
  ) {
    const elementMap = data.scene.assetPlacement;
    const elementRefs = Object.keys(elementPlacement);
    const seed = data.timeStamp;
    const elementsToChange = this.getIndexesToChange(elementRefs.length, seed);

    const svgPlacement: any = {};
    const textboxText: any = {};

    let newList: any = { ...elementPlacement };

    elementsToChange.forEach((i: any) => {
      //IMPORTANT -- THIS HAPPENS RANDOMLY
      //WE ARE JUST HOPPING THAT ALL USERS DON'T PICK THE SAME ELEMENTS
      if (elementRefs[i].includes('dz')) {
        let replacement = this.pickAndRemoveRandomElement(remainingElements);
        newList[elementRefs[i]] = replacement.path;
      }

      if (elementRefs[i].includes('textbox')) {
        let textboxKey = elementRefs[i];
        elementMap.forEach((el: any) => {
          Object.entries(el).forEach(([key, value]) => {
            if (value === textboxKey) {
              let element = this.pickAndRemoveRandomElement(remainingElements);
              newList[elementRefs[i]] = element[key];
            }
          });
        });
      }
    });
    Object.entries(newList).forEach(([key, value]) => {
      if (key.includes('dz')) {
        svgPlacement[key] = value;
      }
      if (key.includes('textbox')) {
        textboxText[key] = value;
      }
    });
    return { svgPlacement, textboxText };
  }

  pickAndRemoveRandomElement(array: any[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    const element = array[randomIndex];
    array.splice(randomIndex, 1);
    return element;
  }

  getIndexesToChange(length: number, seed: number) {
    console.log('length', length);
    //generally we want around 4/5/6/7 elements to change
    // but if there are only 10 elements, we want to change 4
    // but if there are 30 elements we want to change 7.
    // so we want to change 40% of the elements
    let elementsToChange = 4;

    if (length > 10 && length <= 20) {
      elementsToChange = 5;
    }
    if (length > 20 && length < 30) {
      elementsToChange = 6;
    }
    if (length > 30) {
      elementsToChange = 7;
    }

    let array: any = [];
    let i = 0;
    while (array.length < elementsToChange) {
      let s = (seed + i++).toString();
      let n = this.util.getSeededRandomBetween(0, length - 1, s);
      if (!array.includes(n)) {
        array.push(n);
      }
    }
    return array;
  }
}
