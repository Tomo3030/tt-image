import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextBoxService {
  loadText(canvas: fabric.Canvas, textboxes: any[]) {
    Object.entries(textboxes).forEach(([ref, text]) => {
      let textboxContainer = this.getCanvasObject(ref, canvas);
      this.loadTextboxText(text, canvas, textboxContainer);
    });
  }

  private loadTextboxText(
    text: string,
    canvas: fabric.Canvas,
    textboxContainer: any
  ) {
    let tb = textboxContainer._objects[1];
    tb.set({ text });
    tb.set({ fontWeight: 'bold' });
    textboxContainer.selectable = false;
    textboxContainer['fixedAsset'] = true;
  }

  getCanvasObject(ref: string, canvas: fabric.Canvas) {
    let tbArray = canvas.getObjects().filter((o: any) => o.id === ref);
    return tbArray[0];
  }

  constructor() {}
}
