import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  constructor() {}

  rezizeCanvas(myCanvas: ElementRef<HTMLCanvasElement>) {
    const aspectRatio = 9 / 16;
    const windowRatio = window.innerWidth / window.innerHeight;
    let canvasWidth, canvasHeight;

    if (windowRatio > aspectRatio) {
      // Window is wider than needed for the aspect ratio
      canvasHeight = window.innerHeight;
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      // Window is taller
      canvasWidth = window.innerWidth;
      canvasHeight = canvasWidth / aspectRatio;
    }

    myCanvas.nativeElement.width = canvasWidth;
    myCanvas.nativeElement.height = canvasHeight;
  }
}
