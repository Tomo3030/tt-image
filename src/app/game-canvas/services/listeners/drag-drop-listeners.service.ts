import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class DragDropListenersService {
  dz: any[] = [];
  activeDz: any = null;
  initialPos: any = null;
  offScreen: any = null;
  constructor() {}

  initListeners(canvas: fabric.Canvas) {
    this.getCanvasDropZones(canvas);
    this.initDzIntersectListener(canvas);
    this.initClickListeners(canvas);
    this.initDropListener(canvas);
    this.offScreenListener(canvas);
  }

  private getCanvasDropZones(canvas: fabric.Canvas) {
    this.dz = canvas.getObjects().filter((obj) => obj.type === 'dropbox');
  }

  private initDzIntersectListener(canvas: fabric.Canvas) {
    canvas.on('object:moving', (e) => {
      this.handleIntersectedDz(e);
    });
  }

  private initClickListeners(canvas: fabric.Canvas) {
    canvas.on('mouse:down', (e: any) => {
      let target = e.target as any;
      this.initialPos = { left: target.left, top: target.top };

      if (target && target.fixedAsset) {
        if (target.type === 'textbox') {
          this.addRipple(target, canvas);
        }
        if (target.type === 'asset') {
          target = this.dz.find((dz) => dz.id === target.associatedDz);
          this.addRipple(target, canvas);
        }
      }
      if (target && target.selectable) {
        if (target.associatedDz) {
          this.checkIfLeavingDz(target);
        }
      }
    });
  }

  private initDropListener(canvas: fabric.Canvas) {
    canvas.on('mouse:up', (e: any) => {
      if (this.offScreen) {
        canvas.discardActiveObject();
        return e.target.set({
          left: this.initialPos.left,
          top: this.initialPos.top,
        });
      }
      if (e.target && e.target.selectable && e.target.moveable) {
        canvas.discardActiveObject();
        let intersect = this.getIntersectedDz(e);
        if (!intersect) return;
        this.handleDzDrop(intersect, e);
      }
    });
  }

  private offScreenListener(canvas: fabric.Canvas) {
    canvas.on('object:moving', (e: any) => {
      let target = e.target;
      this.checkIfOffscreen(target, canvas);
    });
  }

  private checkIfOffscreen(target: any, canvas: any) {
    this.offScreen = false;

    if (
      target.left < 0 ||
      target.left > canvas.width ||
      target.top < 0 ||
      target.top > canvas.height
    ) {
      this.offScreen = true;
    }
  }

  private handleIntersectedDz(e: any) {
    let intersect = this.getIntersectedDz(e) as any;
    if (intersect && intersect.isEmpty) {
      //if intersected dz is empty
      if (this.activeDz && this.activeDz !== intersect) {
        //if there is an active dz and it is not the intersected dz
        this.activeDz.set({ ...intersect.defaultStyles });
      }
      // set intersected dz as active dz by changing its fill color
      //intersect.set('fill', intersect.activeFill);
      intersect.set({ ...intersect.activeStyles });

      intersect.dirty = true;
      this.activeDz = intersect;
    } else if (this.activeDz?.id) {
      this.activeDz.set({ ...this.activeDz.defaultStyles });
      this.activeDz = null;
    }
  }

  private getIntersectedDz(e: any): fabric.Object | null {
    e.target.setCoords();
    let intersected = null;
    this.dz.forEach((dz) => {
      if (e.target.intersectsWithObject(dz)) {
        return (intersected = dz);
      }
    });
    return intersected;
  }

  private addRipple(target: any, canvas: fabric.Canvas) {
    let rect = new fabric.Rect({
      left: target.getCenterPoint().x,
      top: target.getCenterPoint().y,
      originY: 'center',
      originX: 'center',
      width: target.width! + 6,
      height:
        target.height! * target.scaleY! + target.padding * 2 * target.scaleX!,
      scaleX: 0.01,
      opacity: 0.5,
      fill: 'red',
      selectable: false,
    });
    if (target.radius) {
      rect.set({
        rx: 1000,
        ry: 1000,
      });
    }
    canvas.add(rect);
    rect.animate('scaleX', target.scaleX, {
      duration: 100,
      onChange: canvas.renderAll.bind(canvas),
    });
    rect.animate('opacity', 0, {
      duration: 300,
      onChange: canvas.renderAll.bind(canvas),
      onComplete: () => {
        canvas.remove(rect);
      },
    });
    rect.animate;
  }

  private handleDzDrop(intersect: any, e: any) {
    let asset = e.target as any;
    if (intersect && !intersect.isEmpty) {
      // DZ is occupied place asset below
      e.target.set({
        left: intersect.left * intersect.scaleX,
        top: intersect.top + intersect.height * intersect.scaleY,
      });
    }
    if (intersect && intersect.isEmpty) {
      // DZ is empty place asset center inside DZ
      this.activeDz.set({ ...this.activeDz.activeStyles });
      this.activeDz = null;

      e.target.set({
        left: intersect.getCenterPoint().x,
        top: intersect.getCenterPoint().y,
        originX: 'center',
        originY: 'center',
      });

      asset.associatedDz = intersect.id;
      intersect.isEmpty = false;
      //intersect.fill = intersect.activeFill;
      intersect.set({ ...intersect.activeStyles });
    }
  }

  private checkIfLeavingDz(target: any) {
    let dz = this.dz.find((obj: any) => obj.id === target.associatedDz);
    this.activeDz = dz;
    dz.isEmpty = true;
    //dz.set('stroke', 'RGBA(0,0,0,0.3)');
    dz.set({ ...dz.defaultStyles });
    target.associatedDz = null;
  }
}
