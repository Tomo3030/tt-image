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
    this.initTextListeners(canvas);
  }

  private initTextListeners(canvas: fabric.Canvas) {
    canvas.on('text:changed', (e: any) => {
      if (e.target.width > e.target.maxWidth) {
        console.log('width exceeded');
        let overflow = e.target.text.slice(-2);
        e.target.width = e.target.maxWidth;
        e.target.text = e.target.text.slice(0, -2);
        e.target.text = e.target.text + '\n' + overflow;
        if (e.target.height > e.target.maxHeight) {
          e.target.text = e.target.text.slice(0, -2);
          e.target.hiddenTextarea.value = e.target.text;
          e.target.height = e.target.maxHeight;
        }
        e.target.hiddenTextarea.value = e.target.text;
      }
      // limit text height also when press enter deselects textbox
      if (e.target.height > e.target.maxHeight + 2) {
        e.target.text = e.target.text.slice(0, -1);
        e.target.hiddenTextarea.value = e.target.text;
        e.target.height = e.target.maxHeight;
        canvas.discardActiveObject();
        e.target.isEditing = false;
      }
    });
  }

  private initDzIntersectListener(canvas: fabric.Canvas) {
    this.dz = canvas.getObjects().filter((obj) => obj.type === 'dropzone');
    canvas.on('object:moving', (e) => {
      this.handleIntersectedDz(e, canvas);
    });
  }

  private initClickListeners(canvas: fabric.Canvas) {
    canvas.on('mouse:down', (e: any) => {
      console.log(e.target);
      // if (!!canvas.getActiveObject()) {
      //   console.log('active object', canvas.getActiveObject());
      // } else {
      //   console.log('no active object');
      // }
      let target = e.target as any;
      // ripple effect
      if (target && target.fixedAsset) {
        if (target.type === 'textboxGroup') {
          this.addRipple(target, canvas);
        } else {
          target = this.dz.find((dz) => dz.id === target.associatedDz);
          this.addRipple(target, canvas);
        }
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
        canvas.discardActiveObject();
        let intersect = this.getIntersectedDz(e);
        if (!intersect) return;
        this.handleDzDrop(intersect, e, canvas);
      }
    });
  }

  private handleIntersectedDz(e: any, canvas: fabric.Canvas) {
    let intersect = this.getIntersectedDz(e) as any;
    if (intersect && intersect.empty) {
      //if intersected dz is empty
      if (this.activeDz && this.activeDz !== intersect) {
        //if there is an active dz and it is not the intersected dz
        this.activeDz.set({ ...intersect.default });
      }
      // set intersected dz as active dz by changing its fill color
      //intersect.set('fill', intersect.activeFill);
      intersect.set({ ...intersect.active });

      intersect.dirty = true;
      this.activeDz = intersect;
    } else if (this.activeDz?.id) {
      this.activeDz.set({ ...this.activeDz.default });
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

  private handleDzDrop(intersect: any, e: any, canvas: fabric.Canvas) {
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
      this.activeDz.set({ ...this.activeDz.active });
      this.activeDz = null;

      e.target.set({
        left: intersect.getCenterPoint().x,
        top: intersect.getCenterPoint().y,
        originX: 'center',
        originY: 'center',
      });

      asset.associatedDz = intersect.id;
      intersect.empty = false;
      //intersect.fill = intersect.activeFill;
      intersect.set({ ...intersect.active });
    }
  }

  private checkIfLeavingDz(target: any, canvas: any) {
    let dz = canvas
      .getObjects()
      .find((obj: any) => obj.id === target.associatedDz);
    this.activeDz = dz;
    dz.empty = true;
    //dz.set('stroke', 'RGBA(0,0,0,0.3)');
    dz.set('fill', dz.defaultFill);
    target.associatedDz = null;
  }
}
