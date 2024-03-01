import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { AssetMap } from '../modals/asset-map';

@Injectable({
  providedIn: 'root',
})
export class SvgLoaderService {
  constructor() {}
  ASSET_SCALE: null | number = null;

  async placeSvgsOnScene(params: {
    answerSheet: Record<string, string>;
    canvas: fabric.Canvas;
    additionalAssets: any[];
    members: string[];
    myIndex: number;
    assetMap: AssetMap;
    needsClipPath: boolean;
  }) {
    const {
      answerSheet,
      canvas,
      additionalAssets,
      members,
      myIndex,
      assetMap,
      needsClipPath,
    } = params;

    const dzAssetRefs = Object.keys(answerSheet).filter((ref) =>
      ref.includes('dz')
    );

    const shuffledDzAssetRefs = this.shuffleArray(dzAssetRefs); //will actually be seed shuffle

    const fixedSvgs = shuffledDzAssetRefs.filter((ref, i) => {
      if (myIndex % members.length === i % members.length) return ref;
    });

    let moveableSvgPaths = shuffledDzAssetRefs
      .filter((ref, i) => !fixedSvgs.includes(ref))
      .map((ref) => {
        return answerSheet[ref];
      });

    const additionalAssetPaths = additionalAssets.map((asset) => {
      let basepath = assetMap['base-path'];
      return `${basepath}/${asset.assetName}`;
    });

    moveableSvgPaths = [...moveableSvgPaths, ...additionalAssetPaths];

    await fixedSvgs.forEach((ref) => {
      this.loadSVGToDropzone(
        answerSheet[ref],
        canvas,
        ref,
        assetMap,
        needsClipPath
      );
    });

    const assetContainer = this.getCanvasObject('asset-container', canvas);
    const assetGrid = this.getAssetGrid(
      assetContainer,
      moveableSvgPaths.length
    );

    moveableSvgPaths.forEach((ref, i) => {
      let options = this.getMoveableOptions(assetGrid, i);
      this.loadSvgToAssetContainer(ref, canvas, options, needsClipPath);
    });
  }

  private loadSVGToDropzone(
    assetPath: any,
    canvas: fabric.Canvas,
    dzRef: string,
    assetMap: AssetMap,
    needsClipPath: boolean
  ) {
    return new Promise((resolve, reject) => {
      const dz = this.getCanvasObject(dzRef, canvas) as any;
      if (!this.ASSET_SCALE) this.setAssetScale(dz, assetMap.size);
      this.setAssetScale(dz, { width: 512, height: 512 });

      fabric.loadSVGFromURL(assetPath, (objects, options) => {
        const group = fabric.util.groupSVGElements(objects, options) as any;
        group.scale(this.ASSET_SCALE);

        group.set({
          left: dz.left,
          top: dz.top,
          selectable: false,
          fixedAsset: true,
        });
        dz['empty'] = false;

        canvas.add(group);
        if (needsClipPath) this.addClipPathToAsset(group);
      });
      resolve(true);
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

  private loadSvgToAssetContainer(
    assetPath: any,
    canvas: fabric.Canvas,
    opts: any,
    needsClipPath: boolean
  ) {
    fabric.loadSVGFromURL(assetPath, (objects, options) => {
      const group = fabric.util.groupSVGElements(objects, options) as any;
      group.scale(this.ASSET_SCALE);
      group['defaultScale'] = this.ASSET_SCALE;
      group['moveable'] = true;
      group.set(opts);

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

      canvas.add(group);
      if (needsClipPath) this.addClipPathToAsset(group);
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
    this.ASSET_SCALE = (dzMin / assetMin) * scaleMin;
  }

  getCanvasObject(ref: string, canvas: fabric.Canvas) {
    let dzArr = canvas.getObjects().filter((o: any) => o.id === ref);
    return dzArr[0];
  }

  private shuffleArray(array: any[]) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }
}
