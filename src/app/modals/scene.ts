import { BackgroundService } from '../services/background.service';
import { FontService } from '../services/font.service';
import { SvgLoaderService } from '../services/svg-loader.service';
import { TextBoxService } from '../services/text-box.service';
import { AssetMap } from './asset-map';
import { GameData } from './game-data';
import { SceneConfig } from './scene-config';

// scene: SceneConfig;
// assets: AssetMap;
// members: string[];
// timeStamp: number;
export class Scene {
  constructor(
    // SERVICES
    private backgroundService: BackgroundService,
    private textBoxService: TextBoxService,
    private loader: SvgLoaderService,
    private font: FontService,
    // PROPERTIES
    private canvas: fabric.Canvas,
    private gameData: GameData,
    private assetPlacementMap: any,
    private assetMap: AssetMap,
    private sceneConfig: SceneConfig,
    private members: string[],
    private timeStamp: number
  ) {
    this.canvas = canvas;
    this.gameData = gameData;
    this.assetMap = assetMap;
    this.sceneConfig = sceneConfig;
    this.members = members;
    this.timeStamp = timeStamp;
    this.assetPlacementMap = this._makeAssetPlacementMap();
  }

  public async init() {
    const fontPromise = this.font.loadSceneFont(
      this.gameData.scene.styles?.font
    );
    const loadBackgroundPromise = this.backgroundService.loadBackground(
      this.canvas,
      this.gameData.scene.backgroundPath
    );

    //need to be done first before adding dz, textbox, asset-container
    await Promise.all([fontPromise, loadBackgroundPromise]);

    const dzPromise = this.backgroundService.loadDz(
      this.canvas,
      this.gameData.scene.dzPath,
      this.gameData.scene.styles
    );

    const textboxPromise = this.backgroundService.loadTextBoxes(
      this.canvas,
      this.gameData.scene.textboxPath,
      this.gameData.scene.styles
    );

    const assetContainerPromise = this.backgroundService.loadAssetContainer(
      this.canvas,
      this.gameData.scene.assetContainerPath
    );

    //add dz, textbox, asset-container
    await Promise.all([dzPromise, textboxPromise, assetContainerPromise]);
  }

  public async addSceneElements(user: string) {}

  private _makeAssetPlacementMap() {
    const assets = this._getSceneAssets(this.gameData, this.assetMap);

    const assetPlacement = this._makeAnswerSheet(
      assets.requiredAssets,
      this.gameData.scene.assetPlacement
    );
    let additionalAssetPaths = assets.additionalAssets.map((asset) => {
      return `${assetMap['base-path']}/${asset.assetName}`;
    });
    assetPlacement['asset-container'] = additionalAssetPaths;
    return assetPlacement;
  }

  private _getSceneAssets(data: GameData, assetMap: any) {
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
}
