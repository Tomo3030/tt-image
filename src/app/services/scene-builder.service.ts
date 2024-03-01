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
export class SceneBuilderService {
  _GAME_DATA = {
    members: ['a', 'b', 'c'],
    timeStamp: 240204,
    userName: 'b',
  };

  ASSET_SCALE: null | number = null;
  ASSET_BASE_PATH = '';
  constructor(
    private loader: SvgLoaderService,
    private textBox: TextBoxService
  ) {}

  public async buildScene(canvas: any, data: GameData) {
    const assetPlacement = await this.getAssetPlacement(data);
    const userName = data.members[1];
    const mySVGPlacement = this.getMySVGPlacement(
      assetPlacement,
      data.members,
      userName
    );

    this.loader.placeSvgsOnCanvas(canvas, mySVGPlacement);

    const mytextPlacement = this.getMyTextboxes(
      assetPlacement,
      this.getSceneTextboxes(assetPlacement),
      data.members,
      data.members.indexOf(userName)
    );

    this.textBox.loadText(canvas, mytextPlacement);
  }

  private async loadAssetMap(fileName: string) {
    console.log(fileName);
    const module = await assetMapImports[fileName]();
    return module.default;
  }

  private async getAssetPlacement(data: GameData) {
    const assetMap = (await this.loadAssetMap(data.assets)) as AssetMap;

    const assets = this.getSceneAssets(data, assetMap);

    const assetPlacement = this.makeAnswerSheet(
      assets.requiredAssets,
      data.scene.assetPlacement
    );
    let additionalAssetPaths = assets.additionalAssets.map((asset) => {
      return `${assetMap['base-path']}/${asset.assetName}`;
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

  private getSceneAssets(data: GameData, assetMap: AssetMap) {
    let assets = assetMap.assets;
    let basepath = assetMap['base-path'];
    let assetArray = Object.keys(assets).map((key) => assets[key]);
    let numberOfDz = data.scene.numberOfDz;
    let requiredAssets = assetArray.slice(0, numberOfDz);
    requiredAssets.map((asset) => {
      asset['path'] = `${basepath}/${asset.assetName}`;
    });
    let numberOfAdditinalAssets = data.scene.numberOfAssets - numberOfDz;
    let additionalAssets = assetArray.slice(
      numberOfDz,
      numberOfDz + numberOfAdditinalAssets
    );
    return { requiredAssets, additionalAssets };
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
    return array;
  }
}
