import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fabric } from 'fabric';
import { CanvasService } from './services/canvas.service';
import { DataService } from './services/data.service';
import { CanvasListenerService } from './services/canvas-listener.service';
import { ElementAdderService } from './services/element-adder.service';
import { BackgroundBuilderService } from './services/background-builder.service';

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
    private backgroundBuilderService: BackgroundBuilderService,
    private data: DataService,
    private listener: CanvasListenerService,
    private elementAdder: ElementAdderService
  ) {}

  async ngAfterViewInit() {
    this.canvasService.rezizeCanvas(this.myCanvas);
    this.canvas = new fabric.Canvas(this.myCanvas.nativeElement, {});
    this.canvas.selection = false;
    const data = await this.data.getData();

    await this.backgroundBuilderService.buildBackgroud(this.canvas, data.scene);
    //if (data.assets) this.elementAdder.addElements(this.canvas, data);
    this.listener.initListeners(this.canvas);
  }
}
