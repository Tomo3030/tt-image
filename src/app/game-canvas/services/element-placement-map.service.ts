import { Injectable } from '@angular/core';
import { GameData } from '../../modals/game-data';
import { AssetMap } from '../../modals/asset-map';
import { AssetPlacement } from '../../modals/scene-config';

@Injectable({
  providedIn: 'root',
})
export class ElementPlacementMapService {
  constructor() {}

  makePlacementMap(data: GameData) {
    const USER = 'b';
    const assetMap = data.assets;
    const elements = this.getSceneElements(data, assetMap!);
    const answerSheet = this.makeAnswerSheet(
      elements.requiredAssets,
      data.scene.assetPlacement
    );

    const myElements = this.makeMyPlacementMap(answerSheet, data.members, USER);

    return { answerSheet, myElements };
  }

  private getSceneElements(data: GameData, assetMap: AssetMap) {
    let assets = assetMap.assets;
    let assetArray = Object.keys(assets).map((key) => assets[key]);
    assetArray = this.shuffleArray(assetArray);
    let requiredNumberOfElements = data.scene.requiredNumberOfElements;
    let requiredElements = assetArray.slice(0, requiredNumberOfElements);

    // why is this here?
    if (data.scene.numberOfDz !== 0) {
      let basepath = assetMap['base-path'];
      requiredElements.map((asset) => {
        asset['path'] = `${basepath}/${asset.assetName}`;
      });
    }

    let numberOfAdditinalAssets = data.scene.additionalElements || 0;
    let additionalAssets = assetArray.slice(
      requiredNumberOfElements,
      requiredNumberOfElements + numberOfAdditinalAssets
    );

    return { requiredAssets: requiredElements, additionalAssets };
  }

  private makeAnswerSheet(
    fixedAssets: any[],
    assetPlacement: AssetPlacement[]
  ) {
    let answerSheet: any = {};

    fixedAssets.forEach((asset, i) => {
      Object.entries(asset).forEach(([key, value]) => {
        if (assetPlacement[i][key]) answerSheet[assetPlacement[i][key]] = value;
      });
    });

    return answerSheet;
  }

  private makeMyPlacementMap(
    elementPlacement: any,
    members: string[],
    userName: string
  ) {
    const svgPlacement = this.getMySVGPlacement(
      elementPlacement,
      members,
      userName
    );

    const textboxText = this.getMyTextboxText(
      elementPlacement,
      members,
      userName
    );
    return { svgPlacement, textboxText };
  }

  private getMySVGPlacement(
    assetPlacement: any,
    members: string[],
    userName: string
  ) {
    let assetPlacementKeys = Object.keys(assetPlacement).filter((ref) =>
      ref.includes('dz')
    );
    if (assetPlacementKeys.length === 0) return null;
    let dzAssets = this.divideArray(assetPlacementKeys, members, userName);
    let assetContainerAssets = assetPlacementKeys.filter(
      (ref) => !dzAssets.includes(ref)
    );
    const svgPlacement: any = {};
    dzAssets.forEach((dz, i) => {
      svgPlacement[dz] = assetPlacement[dz];
    });
    (svgPlacement['asset-container'] = assetPlacement['asset-container'] || []),
      assetContainerAssets.forEach((ref) => {
        svgPlacement['asset-container'].push(assetPlacement[ref]);
      });
    return svgPlacement;
  }

  private getMyTextboxText(
    elementPlacement: any,
    members: string[],
    userName: string
  ) {
    let textboxKeys = Object.keys(elementPlacement).filter((ref) =>
      ref.includes('textbox')
    );
    let textboxText = this.divideArray(textboxKeys, members, userName);

    let myTextboxes: any = {};
    textboxText.forEach((ref, i) => {
      myTextboxes[ref] = elementPlacement[ref];
    });

    return myTextboxes || {};
  }

  private divideArray(array: any[], members: string[], userName: string) {
    let myIndex = members.indexOf(userName);
    if (myIndex === -1) throw new Error('User not found in members list');
    let myArray: any[] = [];
    array.forEach((item, i) => {
      if (myIndex % members.length === i % members.length) myArray.push(item);
    });
    return myArray;
  }

  private shuffleArray(array: any[]) {
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
