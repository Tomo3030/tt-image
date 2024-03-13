import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { AssetPlacement } from '../modals/scene-config';
import { GameData } from '../modals/game-data';
import { SvgLoaderService } from './svg-loader.service';
import { assetMapImports } from '../asset-maps/asset-map-imports';
import { AssetMap } from '../modals/asset-map';
import { TextBoxService } from './text-box.service';

@Injectable({
  providedIn: 'root',
})
export class ElementAdderService {
  constructor(
    private loader: SvgLoaderService,
    private textBox: TextBoxService
  ) {}

  public addElements(canvas: any, data: GameData) {
    // element placement might not have DZs, assets, and assetcontainer
    // element placement is essentially answer sheet
    const elementPlacement = this.getElementPlacement(data);

    const userName = data.members[1];

    if (data.scene.numberOfDz !== 0) {
      const assetScaleFactor = data.scene.additionalAssetScale || 1;
      const mySVGPlacement = this.getMySVGPlacement(
        elementPlacement,
        data.members,
        userName
      );
      this.loader
        .placeSvgsOnCanvas(canvas, mySVGPlacement, assetScaleFactor)
        .then(() => {
          canvas.renderAll();
        });
    }

    if (data.scene.numberOfTextBoxes !== 0) {
      const mytextPlacement = this.getMyTextboxes(
        elementPlacement,
        this.getSceneTextboxes(elementPlacement),
        data.members,
        data.members.indexOf(userName)
      );

      this.textBox.loadText(canvas, mytextPlacement);
    }
  }

  getElementPlacement(data: GameData) {
    const assetMap = data.assets;
    const assets = this.getSceneElements(data, assetMap!);
    const assetPlacement = this.makeAnswerSheet(
      assets.requiredAssets,
      data.scene.assetPlacement
    );
    let additionalAssetPaths = assets.additionalAssets.map((asset) => {
      return `${assetMap!['base-path']}/${asset.assetName}`;
    });
    assetPlacement['asset-container'] = additionalAssetPaths;
    return assetPlacement;
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

  private getSceneElements(data: GameData, assetMap: AssetMap) {
    //console.log(data);
    let assets = assetMap.assets;
    let assetArray = Object.keys(assets).map((key) => assets[key]);
    assetArray = this.shuffleArray(assetArray);
    let requiredNumberOfElements = data.scene.requiredNumberOfElements;
    let requiredElements = assetArray.slice(0, requiredNumberOfElements);

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

  getMySVGPlacement(assetPlacement: any, members: string[], userName: string) {
    let assetPlacementKeys = Object.keys(assetPlacement).filter((ref) =>
      ref.includes('dz')
    );
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

  private divideArray(array: any[], members: string[], userName: string) {
    let myIndex = members.indexOf(userName);
    if (myIndex === -1) throw new Error('User not found in members list');
    let myArray: any[] = [];
    array.forEach((item, i) => {
      if (myIndex % members.length === i % members.length) myArray.push(item);
    });
    return myArray;
  }

  private getSceneTextboxes(answerSheet: any) {
    let textBoxes = Object.keys(answerSheet).filter((ref) =>
      ref.includes('textbox')
    );
    return textBoxes;
  }

  private getMyTextboxes(
    answerSheet: any,
    textboxRefs: string[],
    members: string[],
    myIndex: number
  ) {
    let myTextboxes: any = {};
    textboxRefs.forEach((ref, i) => {
      if (myIndex % members.length === i % members.length)
        myTextboxes[ref] = answerSheet[ref];
    });
    return myTextboxes;
  }

  shuffleArray(array: any[]) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }
}
