import { Injectable } from '@angular/core';
import { sceneConfigImports } from '../scene-config/scene-config-imports';
import { GameData } from '../modals/game-data';
import { assetMapImports } from '../asset-maps/asset-map-imports';
import { SceneConfig } from '../modals/scene-config';
import { AssetMap } from '../modals/asset-map';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  FAKE_DATA = {
    scene: 'zoo',
    assets: 'animals',
    members: ['a', 'b', 'c'],
    timeStamp: 240204,
  };

  async getData(): Promise<GameData> {
    let _data = this.FAKE_DATA;
    let scene = await this.getSceneConfig(_data.scene);
    let assets = await this.getAssetMap(_data.assets);

    return {
      scene,
      assets,
      members: _data.members,
      timeStamp: _data.timeStamp,
    };
  }

  async getAssetMap(scene: string): Promise<AssetMap> {
    const module = await assetMapImports[scene]();
    return module.default;
  }

  private async getSceneConfig(scene: string): Promise<SceneConfig> {
    const module = await sceneConfigImports[scene]();
    let m = module.default;
    if (m.dynamicAssetPlacement) {
      let assetPlacement = m.assetPlacement;
      let requiredNumberOfElements = m.requiredNumberOfElements;

      let shuffled = this._shuffleArray(assetPlacement);
      shuffled = shuffled.slice(0, requiredNumberOfElements);
      //shuffle needs to be seed shuffle
      m.assetPlacement = shuffled;

      console.log(shuffled);
    }
    return m;
  }

  private _shuffleArray(array: any[]) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
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
