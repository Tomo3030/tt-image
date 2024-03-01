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

  async buildScene(canvas: any, data: GameData) {
    let assetMap = (await this.loadAssetMap(data.assets)) as AssetMap;
    //this.ASSET_BASE_PATH = assetMap['base-path'];
    const assetPlacement = data.scene.assetPlacement;
    const assets = this.getSceneAssets(data, assetMap);
    const members = this._GAME_DATA.members;
    const myIndex = members.indexOf(this._GAME_DATA.userName);

    const answerSheet = this.makeAnswerSheet(
      assets.requiredAssets,
      assetPlacement
    );

    const needsClipPath = data.scene?.styles?.dz?.needsClipPath || false;

    this.loader.placeSvgsOnScene({
      answerSheet: answerSheet,
      canvas: canvas,
      additionalAssets: assets.additionalAssets,
      members: members,
      myIndex: myIndex,
      assetMap: assetMap,
      needsClipPath: needsClipPath,
    });

    const allTextboxeRefs = this.getSceneTextboxes(answerSheet);
    const myTextboxes = this.getMyTextboxes(
      answerSheet,
      allTextboxeRefs,
      members,
      myIndex
    );

    this.textBox.loadText(canvas, myTextboxes);

    console.log(myTextboxes);
  }

  async loadAssetMap(fileName: string) {
    const module = await assetMapImports[fileName]();
    return module.default;
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

  getSceneAssets(data: GameData, assetMap: AssetMap) {
    let assets = assetMap.assets;
    let basepath = assetMap['base-path'];
    let assetArray = Object.keys(assets).map((key) => assets[key]);
    //assetArray = this.shuffleArray(assetArray);
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
}
