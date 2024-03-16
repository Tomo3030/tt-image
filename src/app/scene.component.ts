import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fabric } from 'fabric';

import { CanvasService } from './services/canvas.service';
import { DataService } from './services/data.service';
import { GameCanvasService } from './game-canvas/game-canvas.service';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display: flex; justify-content: center;">
      <canvas #myCanvas></canvas>
    </div>
  `,
  styles: [],
})
export class SceneComponent implements AfterViewInit {
  @ViewChild('myCanvas') myCanvas!: ElementRef;
  canvas!: fabric.Canvas;

  constructor(
    private canvasService: CanvasService,
    private data: DataService,
    private gameCanvas: GameCanvasService
  ) {}

  async ngAfterViewInit() {
    this.canvasService.rezizeCanvas(this.myCanvas);
    this.canvas = new fabric.Canvas(this.myCanvas.nativeElement, {});
    this.canvas.selection = false;

    const data = await this.data.getData();
    this.gameCanvas.buildScene(this.canvas, data);
  }
}

// this.canvas.on('mouse:down', (e: any) => {
//   this.createRect();
//   // console.log('l');
//   // let f = fabric as any;
//   // f.runningAnimations.cancelByTarget(e.target);
// });
// }

// createRect() {
// let rect = new fabric.Rect({
//   left: -50,
//   top: 100,
//   fill: 'red',
//   width: 50,
//   height: 50,
// });
// this.canvas.add(rect);

// rect.animate('left', 400, {
//   duration: 5000,
//   easing: (t: any, b: any, c: any, d: any) => {
//     return b + (t / d) * c;
//   }, //linear ease
//   onChange: () => {
//     rect.setCoords();
//     this.canvas.requestRenderAll();
//   },
//   onComplete: () => {
//     this.canvas.remove(rect);
//     let objs = this.canvas.getObjects();
//     console.log(objs.length);
//   },
// });
// }
