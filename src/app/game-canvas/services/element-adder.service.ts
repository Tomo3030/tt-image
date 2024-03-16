import { Injectable } from '@angular/core';
import { SvgLoaderService } from './svg-loader.service';
import { TextBoxService } from './text-box.service';

@Injectable({
  providedIn: 'root',
})
export class ElementAdderService {
  constructor(
    private loader: SvgLoaderService,
    private textBox: TextBoxService
  ) {}

  public addElements(
    canvas: any,
    myAssetPlacement: any,
    additionalAssetScale: number
  ) {
    this.addSvgs(canvas, myAssetPlacement.svgPlacement, additionalAssetScale);
    this.addTextboxes(canvas, myAssetPlacement.textboxText);
  }

  private addSvgs(canvas: any, svgPlacement: any, assetScaleFactor: number) {
    this.loader
      .placeSvgsOnCanvas(canvas, svgPlacement, assetScaleFactor)
      .then(() => {
        canvas.renderAll();
      });
  }

  private addTextboxes(canvas: any, textPlacement: any) {
    this.textBox.loadText(canvas, textPlacement);
  }
}
