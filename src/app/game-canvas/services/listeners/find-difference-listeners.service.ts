import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { GameData } from 'src/app/types/game-data';

@Injectable({
  providedIn: 'root',
})
export class FindDifferenceListenersService {
  constructor() {}

  initListeners(canvas: any, data: GameData) {
    this.initClickListeners(canvas);
  }

  initClickListeners(canvas: any) {
    canvas.on('mouse:down', (e: any) => {
      if (e.target.type === 'select-box') {
        this.styleElement(e.target, canvas);
      }

      if (e.target.type === 'asset') {
        let associatedDz = e.target.associatedDz;
        let dz = this.getDz(associatedDz, canvas);
        if (!dz) return;
        this.styleElement(dz, canvas);
      }
      if (e.target.type === 'textbox') {
        let container = e.target.getObjects()[0];
        this.styleElement(container, canvas);
      }
    });
  }

  private styleElement(element: any, canvas: fabric.Canvas) {
    if (element['selected']) {
      element.set({ stroke: null });
      element['selected'] = false;
    } else {
      element.set({ stroke: 'red', strokeWidth: 3 });
      element['selected'] = true;
    }
    canvas.renderAll();
  }

  private getDz(dzId: string, canvas: fabric.Canvas) {
    return canvas.getObjects().find((obj: any) => obj['id'] === dzId);
  }
}
