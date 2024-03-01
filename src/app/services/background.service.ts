import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { TextboxWithPadding } from '../modals/textbox-with-padding';
import { SceneConfig } from '../modals/scene-config';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  constructor() {}
  BG_SCALE = 1;

  async loadScene(canvas: fabric.Canvas, scene: SceneConfig) {
    await this.loadBackground(canvas, scene.backgroundPath);
    await this.loadDz(canvas, scene.dzPath, scene.styles);
    await this.loadTextBoxes(canvas, scene.textboxPath, scene.styles);
    await this.loadAssetContainer(canvas, scene.assetContainerPath);
  }

  private loadBackground(canvas: fabric.Canvas, path: string) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromURL(path, (objects, options) => {
        let group = fabric.util.groupSVGElements(objects, options);
        let scale = canvas.width! / group.width!;
        this.BG_SCALE = scale;
        console.log(this.BG_SCALE);
        group.scale(this.BG_SCALE);
        group.set({
          left: 0,
          top: 0,
          selectable: false,
        });
        canvas.add(group);

        resolve(() => {
          return group;
        });
      });
    });
  }

  private loadDz(canvas: fabric.Canvas, path: string, styles?: any) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromURL(path, (objects, options) => {
        objects.forEach((obj) => {
          if (obj.width! >= 1080) return;
          let dz = this.makeDz(obj, styles);

          if (dz) canvas.add(dz);
        });

        resolve(() => {});
      });
    });
  }

  private loadTextBoxes(canvas: fabric.Canvas, path: string, styles: any) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromURL(path, (objects, options) => {
        objects.forEach((obj, i) => {
          let textBox = this.makeTextBox(obj, styles) as any;
          if (textBox) {
            canvas.add(textBox);
          }
        });
        resolve(() => {});
      });
    });
  }

  private loadAssetContainer(canvas: fabric.Canvas, path: string) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromURL(path, (objects, options) => {
        let container = objects[0] as any;
        let styles = this.getAssetContainerStyle(container);
        let rect = new fabric.Rect({
          ...styles,
        }) as any;
        rect['id'] = 'asset-container';
        canvas.add(rect);
      });
      resolve(() => {});
    });
  }

  private makeTextBox(obj: any, extra_styles?: any) {
    let fontConfig = this.getFontConfig();
    let defaultText = '???';
    let selectedBackgroundColor = extra_styles?.textbox.selectedBackgroundColor;
    let fill = extra_styles?.textbox.fill;
    let styles = this.getTextBoxStyle(obj);
    let borderRadius = extra_styles?.textbox.borderRadius || 0;

    let tb = new TextboxWithPadding(defaultText, {
      defaultText: defaultText,
      selectedBackgroundColor,
      borderRadius,
      fill,

      ...fontConfig,
      ...styles,
    });

    return tb;
  }

  private getFontConfig() {
    return {
      fontSize: 14,
      fontFamily: 'Arial',
      textAlign: 'center',
    };
  }

  private makeDz(obj: any, styles?: any) {
    let object: any;
    let strokeConfig = this.getStrokeConfig();
    let activeFill = styles?.dz.activeFill || 'RGBA(0,0,255,0.1)';

    if (obj.radius) {
      object = new fabric.Circle({
        left: obj.left * this.BG_SCALE,
        top: obj.top * this.BG_SCALE,
        radius: obj.radius * this.BG_SCALE,
        fill: obj.fill,
        selectable: false,
      });
    } else {
      object = new fabric.Rect({
        left: obj.left * this.BG_SCALE,
        top: obj.top * this.BG_SCALE,
        width: obj.width * this.BG_SCALE,
        height: obj.height * this.BG_SCALE,
        fill: obj.fill,
        rx: 10,
        ry: 10,
        selectable: false,
      });
    }
    object['id'] = obj.id;
    object['type'] = 'dropzone';
    object['empty'] = true;
    object['defaultFill'] = obj.fill;
    object['activeFill'] = activeFill;

    return object;
  }

  private getTextBoxStyle(obj: any) {
    return {
      left: obj.left * this.BG_SCALE,
      top: obj.top * this.BG_SCALE,
      width: obj.width * this.BG_SCALE,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      editable: true,
      selectable: true,
      totalHeight: obj.height * this.BG_SCALE,
      defaultBg: obj.fill,
      id: obj.id,
      backgroundColor: obj.fill,
    };
  }

  private getAssetContainerStyle(obj: any) {
    return {
      left: obj.left * this.BG_SCALE,
      top: obj.top * this.BG_SCALE,
      width: obj.width * this.BG_SCALE,
      height: obj.height * this.BG_SCALE,
      fill: 'transparent',
      selectable: false,
    };
  }

  private getStrokeConfig(): {
    strokeWidth: number;
    strokeDashArray: number[];
  } {
    let strokeConfig = {
      strokeWidth: 2,
      strokeDashArray: [5, 7],
    };
    if (this.BG_SCALE === 1) {
      console.log(strokeConfig);
      strokeConfig = {
        strokeWidth: 2,
        strokeDashArray: [3, 3],
      };
    }
    return strokeConfig;
  }
}
