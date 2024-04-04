import { AssetMap } from './asset-map';
import { SceneConfig } from './scene-config';

export interface GameData {
  scene: SceneConfig;
  assets: AssetMap;
  members: string[];
  timeStamp: number;
  type: string;
}
