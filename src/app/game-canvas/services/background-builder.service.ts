import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { SceneConfig } from '../../modals/scene-config';
import { FontService } from './font.service';
import { TextboxGroup } from '../../modals/textbox-group';
import { BackgroundColorService } from '../../services/background-color.service';

@Injectable({
  providedIn: 'root',
})
export class BackgroundBuilderService {
  constructor(private fontService: FontService) {}
  BG_SCALE = 1;
  canvas: any;

  async buildBackgroud(
    canvas: fabric.Canvas,
    scene: SceneConfig
  ): Promise<void> {
    this.canvas = canvas;
    //this.backgroundColor.changeBackgroundColor('#BF9AC4');

    await Promise.all([
      this.fontService.loadSceneFont(scene.styles?.font),
      this.loadBackgroundImg(canvas, scene.backgroundPath),
    ]);
    await Promise.all([
      this.placeDzsOnCanvas(canvas, scene.dzPath, scene.styles?.dz),
      this.placeTextboxesOnCanvas(canvas, scene.textboxPath, scene.styles),
      this.placeAssetContainerOnCanvas(canvas, scene.assetContainerPath),
    ]);
  }

  loadBackgroundImg(canvas: fabric.Canvas, path: string) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromURL(path, (objects, options) => {
        let group = fabric.util.groupSVGElements(objects, options);
        this.BG_SCALE = canvas.width! / group.width!;
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

  placeDzsOnCanvas(canvas: fabric.Canvas, path: string, styles?: any) {
    if (!path) return Promise.resolve();
    return new Promise((resolve, reject) => {
      this.createFabricObject({}, styles, 'dz-rect');
      //test about active and default styles.

      fabric.loadSVGFromURL(path, (objects, options) => {
        objects.forEach((obj) => {
          if (obj.width! >= 1080) return;
          let dz = this.createFabricObject(obj, styles, 'dz-rect');
          if (dz) canvas.add(dz);
        });
        resolve(() => {});
      });
    });
  }

  placeTextboxesOnCanvas(canvas: fabric.Canvas, path: string, styles: any) {
    if (!path) return Promise.resolve();

    return new Promise((resolve, reject) => {
      fabric.loadSVGFromURL(path, (objects, options) => {
        let fontConfig = this.getTextConfig(styles.font);

        objects.forEach((obj, i) => {
          let defaultText = '???';
          let font = fontConfig;
          let _styles = { ...styles.textbox, ...font, defaultText };
          let textBox = this.createFabricObject(obj, _styles, 'textbox') as any;
          if (textBox) {
            canvas.add(textBox);
          }
          resolve(() => {});
        });
      });
    });
  }

  private getTextConfig(font: any) {
    return {
      fontSize: 14,
      fontFamily: font.fontFamily,
      textAlign: font.textAlign,
      textFill: font.textFill,
      verticallyCenterText: font.verticalCenterText,
    };
  }

  placeAssetContainerOnCanvas(canvas: fabric.Canvas, path: string) {
    if (!path) return Promise.resolve();
    return new Promise((resolve, reject) => {
      fabric.util.loadImage('./assets/plus2.png', (img) => {
        let pattern = new fabric.Pattern({
          source: img,
          repeat: 'repeat',
        });

        fabric.loadSVGFromURL(path, (objects, options) => {
          let container = objects[0] as any;
          let rect = this.createFabricObject(container, {}, 'assetContainer');
          rect.fill = pattern;
          rect.opacity = 0.1;
          canvas.add(rect);
          resolve(() => {});
        });
      });
    });
  }

  private createFabricObject(
    obj: any,
    styles: any,
    type: 'dz-rect' | 'dz-circle' | 'textbox' | 'assetContainer'
  ) {
    const baseProps = {
      left: obj.left * this.BG_SCALE,
      top: obj.top * this.BG_SCALE,
      height: obj.height * this.BG_SCALE,
      width: obj.width * this.BG_SCALE,

      id: obj.id,
    };
    const dzProps = {
      empty: true,
      type: 'dropzone',
      selectable: false,
      defaultFill: obj.fill,
      ...styles,
    };

    switch (type) {
      case 'dz-rect':
        return new fabric.Rect({
          ...baseProps,
          ...dzProps,
          rx: styles.borderRadius || 0,
          ry: styles.borderRadius || 0,
          fill: obj.fill,
        });
      //no such thing as dz-circle currently
      case 'dz-circle':
        return new fabric.Circle({
          ...baseProps,
          ...dzProps,
          radius: obj.radius * this.BG_SCALE,
          fill: obj.fill,
        });
      case 'textbox':
        return new TextboxGroup(
          {
            ...baseProps,
            ...styles,
            type: 'textbox',
            maxWidth: obj.width * this.BG_SCALE,
            maxHeight: obj.height * this.BG_SCALE,
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            editable: true,
            selectable: true,
            id: obj.id,
            fill: obj.fill,
            textFill: styles.textFill,
            activeBorder: styles.activeBorder,
          },
          this.canvas
        );

      case 'assetContainer':
        return new fabric.Rect({
          ...baseProps,
          ...styles,
          selectable: false,
          fill: 'transparent',
        });
    }
  }
}
