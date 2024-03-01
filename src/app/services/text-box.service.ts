import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextBoxService {
  loadText(canvas: fabric.Canvas, textboxes: any[]) {
    Object.entries(textboxes).forEach(([ref, text]) => {
      let textbox = this.getCanvasObject(ref, canvas);
      this.loadTextboxText(text, canvas, textbox);
    });
  }

  private loadTextboxText(text: string, canvas: fabric.Canvas, textbox: any) {
    textbox.set({ text });
    textbox.set({ fontWeight: 'bold' });

    canvas.renderAll();
    textbox.selectable = false;
    textbox['fixedAsset'] = true;
  }

  getCanvasObject(ref: string, canvas: fabric.Canvas) {
    let dzArr = canvas.getObjects().filter((o: any) => o.id === ref);
    return dzArr[0];
  }

  constructor() {}
}
