import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { DragDropListenersService } from './drag-drop-listeners.service';
import { FindDifferenceListenersService } from './find-difference-listeners.service';
import { GameData } from 'src/app/types/game-data';

@Injectable({
  providedIn: 'root',
})
export class CanvasListenerService {
  constructor(
    private dragDropListner: DragDropListenersService,
    private findDifferenceListener: FindDifferenceListenersService
  ) {}

  initListeners(canvas: fabric.Canvas, data: GameData) {
    if (data.type === 'drag-drop') {
      this.dragDropListner.initListeners(canvas);
    }
    if (data.type === 'spot-the-difference') {
      this.findDifferenceListener.initListeners(canvas, data);
    }
  }
}
