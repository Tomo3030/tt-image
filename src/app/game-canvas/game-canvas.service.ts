import { Injectable } from '@angular/core';
import { GameData } from '../modals/game-data';
import { BackgroundBuilderService } from './services/background-builder.service';
import { CanvasListenerService } from './services/canvas-listener.service';
import { ElementAdderService } from './services/element-adder.service';
import { ElementPlacementMapService } from './services/element-placement-map.service';

@Injectable({
  providedIn: 'root',
})
export class GameCanvasService {
  answerSheet: any;
  myElements: any;
  constructor(
    private backgroundBuilderService: BackgroundBuilderService,
    private elementMapService: ElementPlacementMapService,
    private elementAdderService: ElementAdderService,
    private canvasLister: CanvasListenerService
  ) {}

  async buildScene(canvas: fabric.Canvas, data: GameData) {
    console.log('building scene');

    const maps = this.elementMapService.makePlacementMap(data);
    console.log(maps);
    this.answerSheet = maps.answerSheet;
    this.myElements = maps.myElements;

    await this.backgroundBuilderService.buildBackgroud(canvas, data.scene);
    this.elementAdderService.addElements(
      canvas,
      maps.myElements,
      data.scene.additionalAssetScale
    );
    this.canvasLister.initListeners(canvas);
  }
}
