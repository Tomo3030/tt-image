import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class CanvasListenerService {
  dz: any[] = [];
  activeDz: any = null;
  constructor() {}

  initListeners(canvas: fabric.Canvas) {
    this.initDzIntersectListener(canvas);
    this.initClickListeners(canvas);
    this.initDropListener(canvas);
  }

  private initDzIntersectListener(canvas: fabric.Canvas) {
    this.dz = canvas.getObjects().filter((obj) => obj.type === 'dropzone');
    canvas.on('object:moving', (e) => {
      this.handleIntersectedDz(e, canvas);
    });
  }

  private initClickListeners(canvas: fabric.Canvas) {
    canvas.on('mouse:down', (e: any) => {
      let target = e.target as any;
      // ripple effect
      if (target && target.fixedAsset) {
        this.addRipple(target, canvas);
      }
      if (target && target.selectable) {
        if (target.associatedDz) {
          this.checkIfLeavingDz(target, canvas);
        }
      }
    });
  }

  private initDropListener(canvas: fabric.Canvas) {
    canvas.on('mouse:up', (e: any) => {
      if (e.target && e.target.selectable && e.target.moveable) {
        let intersect = this.getIntersectedDz(e);
        if (!intersect) return;
        this.handleDzDrop(intersect, e);
      }
    });
  }

  private handleIntersectedDz(e: any, canvas: fabric.Canvas) {
    let intersect = this.getIntersectedDz(e) as any;
    if (intersect && intersect.empty) {
      //if intersected dz is empty
      if (this.activeDz && this.activeDz !== intersect) {
        //if there is an active dz and it is not the intersected dz
        this.activeDz.set('fill', intersect.defaultFill);
      }
      // set intersected dz as active dz by changing its fill color
      intersect.set('fill', intersect.activeFill);
      intersect.dirty = true;

      this.activeDz = intersect;
    } else if (this.activeDz?.id) {
      this.activeDz.set('fill', this.activeDz.defaultFill);
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
      left: target.left! + (target.width! / 2) * target.scaleX!,
      top: target.top! - target.padding * target.scaleX!,
      width: target.width! + 6,
      //height: target.height! + target.padding * 2 * target.scaleX!,
      height:
        target.height! * target.scaleY! + target.padding * 2 * target.scaleX!,
      scaleX: 0.01,

      opacity: 0.5,
      originX: 'center',
      fill: 'red',
      selectable: false,
    });
    if (target.clipPath) {
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
    if (intersect && !intersect.empty) {
      // DZ is occupied place asset below
      e.target.set({
        left: intersect.left * intersect.scaleX,
        top: intersect.top + intersect.height * intersect.scaleY,
      });
    }
    if (intersect && intersect.empty) {
      // DZ is empty place asset center inside DZ
      this.activeDz.set('fill', intersect.defaultFill);
      this.activeDz = null;

      e.target.set({
        left: intersect.left + intersect.strokeWidth,
        top: intersect.top + intersect.strokeWidth,
      });

      asset.associatedDz = intersect.id;
      intersect.empty = false;
      intersect.fill = intersect.activeFill;
    }
  }

  private checkIfLeavingDz(target: any, canvas: any) {
    let dz = canvas
      .getObjects()
      .find((obj: any) => obj.id === target.associatedDz);
    console.log(dz);
    this.activeDz = dz;
    dz.empty = true;
    //dz.set('stroke', 'RGBA(0,0,0,0.3)');
    dz.set('fill', dz.defaultFill);
    target.associatedDz = null;
  }
}
