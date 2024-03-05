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
    scene: 'supermarket',
    assets: 'fruits',
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
    return module.default;
  }
}
