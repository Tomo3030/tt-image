import { Injectable } from '@angular/core';
import { sceneConfigImports } from '../scene-config/scene-config-imports';
import { GameData } from '../types/game-data';
import { assetMapImports } from '../asset-maps/asset-map-imports';
import { SceneConfig } from '../types/scene-config';
import { AssetMap } from '../types/asset-map';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}
  private current = 0;
  private games = [
    {
      scene: 'supermarket',
      assets: 'fruits',
    },
    {
      scene: 'zoo',
      assets: 'animals',
    },
    {
      scene: 'people-contact',
      assets: 'avatar-men',
    },
  ];

  FAKE_DATA = {
    scene: this.games[this.current].scene,
    assets: this.games[this.current].assets,
    members: ['a', 'b', 'c'],
    timeStamp: 240204,
    //type: 'spot-the-difference',
    type: 'drag-drop',
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
      type: _data.type,
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
