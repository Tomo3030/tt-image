import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { DropBox } from 'src/app/types/fabric/drop-box';
import { SelectBox } from 'src/app/types/fabric/select-box';
import { TextboxGroup } from 'src/app/types/fabric/textbox-group';

@Injectable({
  providedIn: 'root',
})
export class ElementMakerService {
  constructor() {}

  makeContainer(obj: any, styles: any, type: string, scale: number) {
    const baseProps = this.getBaseProps(obj, scale);
    if (type === 'drag-drop') {
      return new DropBox({
        ...baseProps,
        ...styles,
        rx: styles.borderRadius || 0,
        ry: styles.borderRadius || 0,
        fill: obj.fill,
      });
    }
    if (type === 'spot-the-difference') {
      return new SelectBox({
        ...baseProps,
        ...styles,
        rx: styles.borderRadius || 0,
        ry: styles.borderRadius || 0,
        fill: obj.fill,
      });
    }
  }

  makeTextbox(obj: any, styles: any, scale: number) {
    const baseProps = this.getBaseProps(obj, scale);
    return new TextboxGroup({
      ...baseProps,
      ...styles,
      fill: obj.fill,
    });
  }

  makeAssetContainer(obj: any, scale: number) {
    const baseProps = this.getBaseProps(obj, scale);
    return new fabric.Rect({
      ...baseProps,
      left: baseProps.left + 20,
      width: baseProps.width - 40,
      fill: 'white',
      opacity: 0.5,
      rx: 10,
      ry: 10,
      selectable: false,
    });
  }

  private getBaseProps(obj: any, scale: number) {
    return {
      left: obj.left * scale,
      top: obj.top * scale,
      height: obj.height * scale,
      width: obj.width * scale,
      id: obj.id,
    };
  }
}
