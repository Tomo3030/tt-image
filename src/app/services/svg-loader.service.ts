import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class SvgLoaderService {
  constructor() {}
  ASSET_SCALE: null | number = null;
  NEEDS_CLIP_PATH = false;

  async placeSvgsOnCanvas(canvas: fabric.Canvas, svgPlacements: any) {
    console.log(svgPlacements);
    this.loadSvgsToDropzones(canvas, svgPlacements);
    this.loadSvgsToAssetContainer(canvas, svgPlacements['asset-container']);
  }

  private loadSvgsToDropzones(
    canvas: fabric.Canvas,
    svgPlacement: Record<string, string>
  ) {
    Object.entries(svgPlacement).forEach(([key, path]) => {
      if (key !== 'asset-container') {
        let dz = this.getCanvasObject(key, canvas);
        if (!dz) return;

        fabric.loadSVGFromURL(path, (objects, options) => {
          const group = fabric.util.groupSVGElements(objects, options) as any;
          let opts = this.getDzSvgOptions(dz, group);
          group.scale(opts.scale);
          group.set(opts);
          canvas.add(group);
          if (this.NEEDS_CLIP_PATH) this.addClipPathToAsset(group);
        });
      }
    });
  }

  private getDzSvgOptions(dz: any, group: any) {
    if (!this.ASSET_SCALE)
      this.setAssetScale(dz, { width: group.width, height: group.height });
    if (dz.radius) this.NEEDS_CLIP_PATH = true;
    let center = dz.getCenterPoint();
    return {
      scale: this.ASSET_SCALE,
      left: center.x,
      top: center.y,
      selectable: false,
      fixedAsset: true,
      associatedDz: dz.id,
      originX: 'center',
      originY: 'center',
    };
  }

  private loadSvgsToAssetContainer(canvas: fabric.Canvas, assetPath: string[]) {
    const assetContainer = this.getCanvasObject('asset-container', canvas);
    const assetGrid = this.getAssetGrid(assetContainer, assetPath.length);

    assetPath.forEach((path, i) => {
      let opts = this.getMoveableOptions(assetGrid, i);
      fabric.loadSVGFromURL(path, (objects, options) => {
        const group = fabric.util.groupSVGElements(objects, options) as any;
        group.scale(this.ASSET_SCALE);
        group.set(opts);
        group['defaultScale'] = this.ASSET_SCALE;
        group['moveable'] = true;
        this.addAnimationListeners(group, canvas);

        canvas.add(group);
        if (this.NEEDS_CLIP_PATH) this.addClipPathToAsset(group);
      });
    });
  }

  getMoveableOptions(assetGrid: { left: number; top: number }[], i: number) {
    return {
      left: assetGrid[i].left,
      top: assetGrid[i].top,
      selectable: true,
      controls: false,
    };
  }

  private addAnimationListeners(group: any, canvas: fabric.Canvas) {
    group.on('mousedown', (e: any) => {
      fabric.util.animate({
        startValue: group.scaleX,
        endValue: group.defaultScale * 1.15,
        duration: 100,
        onChange: (value) => {
          group.scale(value);
          canvas.renderAll();
        },
      });
    });

    group.on('mouseup', (e: any) => {
      fabric.util.animate({
        startValue: group.scaleX,
        endValue: group.defaultScale,
        duration: 100,
        onChange: (value) => {
          group.scale(value);
          canvas.renderAll();
        },
      });
    });
  }

  private getAssetGrid(assetContainer: any, assetLength: number) {
    if (assetLength > 10) throw new Error('Too many assets');

    const gridPositions: { left: number; top: number }[] = [];
    const rows = assetLength <= 5 ? 1 : 2;
    const itemsPerRow = Math.ceil(assetLength / rows);
    const itemWidth = assetContainer.width / itemsPerRow;
    const itemHeight = assetContainer.height / rows;

    for (let row = 0; row < rows; row++) {
      let top = assetContainer.top + itemHeight * row;
      // Adjust top for single row case to center vertically
      if (rows === 1) top += (assetContainer.height - itemHeight) / 2;

      for (let col = 0; col < itemsPerRow; col++) {
        // Only add positions for actual assets
        if (row * itemsPerRow + col >= assetLength) break;

        let left = itemWidth * col;
        gridPositions.push({ left, top });
      }
    }

    return gridPositions;
  }

  private addClipPathToAsset(group: any) {
    let clipPath = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      radius: group.width / 2,
      left: 0,
      top: 0,
    });

    group.clipPath = clipPath;
  }

  private setAssetScale(dz: any, assetSize: any) {
    const scaleMin = Math.min(dz.scaleX, dz.scaleY);
    const dzMin = Math.min(dz.width, dz.height);
    const assetMin = Math.min(assetSize.width, assetSize.height);
    this.ASSET_SCALE = (dzMin / assetMin) * scaleMin * 0.7;
  }

  getCanvasObject(ref: string, canvas: fabric.Canvas) {
    let dzArr = canvas.getObjects().filter((o: any) => o.id === ref);
    return dzArr[0];
  }
}
