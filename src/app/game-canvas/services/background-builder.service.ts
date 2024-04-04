import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { FontService } from './font.service';
import { BackgroundColorService } from '../../services/background-color.service';
import { GameData } from 'src/app/types/game-data';
import { ElementMakerService } from './element-maker.service';

@Injectable({
  providedIn: 'root',
})
export class BackgroundBuilderService {
  constructor(
    private fontService: FontService,
    private backgroundColor: BackgroundColorService,
    private elementMaker: ElementMakerService
  ) {}
  BG_SCALE = 1;
  canvas: any;

  async buildBackgroud(canvas: fabric.Canvas, data: GameData): Promise<void> {
    this.canvas = canvas;
    const scene = data.scene;
    const gameType = data.type;
    this.backgroundColor.changeBackgroundColor(scene.backgroundFill);

    await Promise.all([
      this.fontService.loadSceneFont(scene.styles?.font),
      this.loadBackgroundImg(canvas, scene.backgroundPath),
    ]);
    await Promise.all([
      this.placeContainersOnCanvas(
        canvas,
        scene.dzPath,
        scene.styles?.dz,
        gameType
      ),
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

  async placeContainersOnCanvas(
    canvas: fabric.Canvas,
    path: string,
    styles: any,
    gameType: string
  ) {
    if (!path) return;
    const containers = (await this.loadSvgFromUrl(path)) as any[];
    console.log(containers);
    containers.forEach((c: any) => {
      if (c.width >= 1080) return;
      const container = this.elementMaker.makeContainer(
        c,
        styles,
        gameType,
        this.BG_SCALE
      );
      if (container) canvas.add(container);
    });
  }

  loadSvgFromUrl(path: string) {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromURL(path, (objects, options) => {
        if (objects) {
          resolve(objects);
        } else {
          reject(new Error('No objects found'));
        }
      });
    });
  }

  async placeTextboxesOnCanvas(
    canvas: fabric.Canvas,
    path: string,
    styles: any
  ) {
    if (!path) return;
    let fontConfig = this.getTextConfig(styles.font);
    let textboxes = (await this.loadSvgFromUrl(path)) as any;
    let _styles = { ...styles.textbox, ...fontConfig, defaultText: '???' };
    textboxes.forEach((obj: any) => {
      let textbox = this.elementMaker.makeTextbox(obj, _styles, this.BG_SCALE);
      if (textbox) canvas.add(textbox);
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
      fabric.loadSVGFromURL(path, (objects, options) => {
        let container = objects[0] as any;
        let rect = this.elementMaker.makeAssetContainer(
          container,
          this.BG_SCALE
        );
        canvas.add(rect);
        resolve(() => {});
      });
    });
  }
}
