import { Injectable } from '@angular/core';
import { GameData } from '../types/game-data';
import { BackgroundBuilderService } from './services/background-builder.service';
import { CanvasListenerService } from './services/listeners/canvas-listener.service';
import { ElementAdderService } from './services/add-elements/element-adder.service';
import { ElementPlacementService } from './services/placement/element-placement.service';

@Injectable({
  providedIn: 'root',
})
export class GameCanvasService {
  correctElementPlacements: any;
  playerElementPlacements: any;
  constructor(
    private backgroundBuilderService: BackgroundBuilderService,
    private elementPlacementService: ElementPlacementService,
    private elementAdderService: ElementAdderService,
    private canvasLister: CanvasListenerService
  ) {}

  public async buildScene(canvas: fabric.Canvas, data: GameData) {
    const elementPlacements = this.elementPlacementService.getElementPlacements(
      data,
      'b'
    );
    this.correctElementPlacements = elementPlacements.answerSheet;
    this.playerElementPlacements = elementPlacements.playerElementPlacements;

    await this.backgroundBuilderService.buildBackgroud(canvas, data);

    this.elementAdderService.addElements(
      canvas,
      this.playerElementPlacements,
      data.scene.additionalAssetScale
    );

    this.canvasLister.initListeners(canvas, data);
  }
}
