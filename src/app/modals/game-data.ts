import { SceneConfig } from './scene-config';

export interface GameData {
  scene: SceneConfig;
  assets: string;
  members: string[];
  timeStamp: number;
}
