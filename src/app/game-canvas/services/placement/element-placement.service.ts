import { Injectable } from '@angular/core';
import { GameData } from '../../../types/game-data';
import { AssetMap } from '../../../types/asset-map';
import { AssetPlacement } from '../../../types/scene-config';
import { DragDropElementsService } from './drag-drop-elements.service';
import { FindDifferenceService } from './find-difference.service';

@Injectable({
  providedIn: 'root',
})
export class ElementPlacementService {
  constructor(
    private dragDropService: DragDropElementsService,
    private findDifference: FindDifferenceService
  ) {}

  // so our answer sheet is going to need a little bit of different logic.
  // Each DZ should be associated with an array of elements that are allowed to be placed there.
  // because imagine we had people and animals, we wouldn't want to place a person in the animal DZ.
  // or in kitchen scene we have hanging assets and shelf assets.

  public getElementPlacements(data: GameData, userName: string) {
    const allElements = this.getShuffledElements(data.assets!);
    const sceneElements = allElements.slice(
      0,
      data.scene.requiredNumberOfElements
    );
    const remainingElements = allElements.slice(
      data.scene.requiredNumberOfElements
    );

    const baseElementLocations = this.assignElementsLocations(
      sceneElements,
      data.scene.assetPlacement
    );

    const answerSheet = this.makeAnswerSheet(data, baseElementLocations);

    const playerElementPlacements = this.makePlayerElementLocations(
      baseElementLocations,
      remainingElements,
      data,
      userName
    );

    return { answerSheet, playerElementPlacements };
  }

  private getShuffledElements(assetMap: AssetMap) {
    const basePath = assetMap['base-path'];
    const assetArray = Object.keys(assetMap.assets).map((key) => {
      return {
        ...assetMap.assets[key],
        path: `${basePath}/${assetMap.assets[key].assetName}`,
      };
    });
    this.shuffleArray(assetArray);

    return assetArray;
  }

  makeAnswerSheet(gameData: GameData, baseElementLocations: any) {
    // if (gameData.type === 'drag-drop') {
    //   return baseElementLocations;
    // }
    return baseElementLocations;
  }

  private assignElementsLocations(
    fixedAssets: any[],
    assetPlacement: AssetPlacement[]
  ) {
    let answerSheet: any = {};
    assetPlacement.forEach((placement, i) => {
      Object.entries(placement).forEach(([key, value]) => {
        answerSheet[value] = fixedAssets[i][key];
      });
    });
    return answerSheet;
  }

  private makePlayerElementLocations(
    baseElementLocations: any,
    allElements: any[],
    data: GameData,
    userName: string
  ) {
    if (data.type === 'spot-the-difference')
      return this.findDifference.getFindDifferencePlacements(
        baseElementLocations,
        allElements,
        data,
        userName
      );

    if (data.type === 'drag-drop')
      return this.dragDropService.getDragDropPlacements(
        baseElementLocations,
        allElements,
        data,
        userName
      );
    else throw new Error('Invalid game type');
  }

  private shuffleArray(array: any[]) {
    //this will be seed random

    // let currentIndex = array.length,
    //   randomIndex;
    // while (currentIndex !== 0) {
    //   randomIndex = Math.floor(Math.random() * currentIndex);
    //   currentIndex--;
    //   [array[currentIndex], array[randomIndex]] = [
    //     array[randomIndex],
    //     array[currentIndex],
    //   ];
    // }
    return array;
  }
}
