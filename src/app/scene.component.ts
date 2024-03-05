import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fabric } from 'fabric';
import { CanvasService } from './services/canvas.service';
import { BackgroundService } from './services/background.service';
import { DataService } from './services/data.service';
import { CanvasListenerService } from './services/canvas-listener.service';
import { SceneBuilderService } from './services/scene-builder.service';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [CommonModule],
  template: ` <canvas #myCanvas></canvas> `,
  styles: [],
})
export class SceneComponent implements AfterViewInit {
  @ViewChild('myCanvas') myCanvas!: ElementRef;
  canvas!: fabric.Canvas;
  constructor(
    private canvasService: CanvasService,
    private backgroundService: BackgroundService,
    private data: DataService,
    private listener: CanvasListenerService,
    private sceneBuilder: SceneBuilderService
  ) {}

  async ngAfterViewInit() {
    this.canvasService.rezizeCanvas(this.myCanvas);
    this.canvas = new fabric.Canvas(this.myCanvas.nativeElement, {});
    this.canvas.selection = false;
    this.canvas.selectionLineWidth = 5;
    const data = await this.data.getData();

    await this.backgroundService.loadScene(this.canvas, data.scene);
    this.sceneBuilder.buildScene(this.canvas, data);
    this.listener.initListeners(this.canvas);
  }
}
