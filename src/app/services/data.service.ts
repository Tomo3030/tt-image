import { Injectable } from '@angular/core';
import { config } from 'src/app/scene-config/supermarket';
import { GameData } from '../modals/game-data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  getData() {
    let data = this.getGameData();
    //let scene = this.getSceneData(data.scene);
    return data;
    //need to return the scene data
    //and the assets
    // and sceneConfig
    //sceneData will be list of links with bg, dz, and textboxes, assetcontainer
    //assets will be list of links to images
    //sceneConfig will explain how many dz and textboxes and their associations
  }

  private getGameData(): GameData {
    let scene = this.getSceneData('supermarket');
    return {
      scene: scene,
      assets: 'fruits',
      members: ['a', 'b', 'c'],
      timeStamp: 240204,
    };
  }

  getSceneData(sceneName: string) {
    return {
      ...config,
    };
  }
}
