import { fabric } from 'fabric';

export const TextboxGroup = fabric.util.createClass(fabric.Group, {
  type: 'textboxGroup',
  initialize: function (styles: any, canvas: fabric.Canvas) {
    this._styles = styles;
    this.textRef;

    this.text = styles.text || styles.defaultText;
    const rect = new fabric.Rect({
      left: styles.left,
      top: styles.top,
      width: styles.width,
      height: styles.height,
      fill: styles.fill,
      rx: styles.borderRadius,
      ry: styles.borderRadius,
      selectable: false,
    });

    const text = new fabric.Textbox(this.text, {
      left: styles.left,
      top: styles.top,
      width: styles.width,
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fill: styles.textFill,
      textAlign: 'center',
      editable: true,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      isWrapping: true,
    }) as any;

    text['maxHeight'] = styles.maxHeight;
    text['maxWidth'] = styles.maxWidth;
    text['defaultText'] = styles.defaultText;

    // if textbox is one line - probobly want to center it.
    // if multiline, then just set at top.

    if (styles.verticallyCenterText) {
      text['top'] = styles.top + styles.height / 2 - text.height / 2;
    }

    text.on('deselect', (e: any) => {});

    this.callSuper('initialize', [rect, text], {
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      subTargetCheck: true,
      borderColor: 'blue',
      borderScaleFactor: 2,
      id: styles.id,
    });
  },

  _render: function (ctx: any) {
    this.callSuper('_render', ctx);
  },

  // add radius to the control box
  // this was taken from here: https://stackoverflow.com/questions/67251210/fabric-js-how-to-set-border-radius-on-bounding-box-of-selected-objects
  _renderControls: function (ctx: any, styleOveride: any) {
    ctx.strokeStyle = this._styles.activeBorder || 'blue';
    ctx.lineWidth = this.borderScaleFactor;
    const wh = this._calculateCurrentDimensions(),
      strokeWidth = this.borderScaleFactor,
      width = wh.x + strokeWidth,
      height = wh.y + strokeWidth;

    const rx = this._styles.borderRadius || 0,
      ry = this._styles.borderRadius || 0,
      w = wh.x,
      h = wh.y,
      // x = this.left - this.borderScaleFactor / 2,
      // y = this.top - this.borderScaleFactor / 2,
      x = this.left,
      y = this.top,
      isRounded = true,
      /* "magic number" for bezier approximations of arcs */
      k = 1 - 0.5522847498;
    ctx.beginPath();

    ctx.moveTo(x + rx, y);

    ctx.lineTo(x + w - rx, y);
    isRounded &&
      ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry);

    ctx.lineTo(x + w, y + h - ry);
    isRounded &&
      ctx.bezierCurveTo(
        x + w,
        y + h - k * ry,
        x + w - k * rx,
        y + h,
        x + w - rx,
        y + h
      );

    ctx.lineTo(x + rx, y + h);
    isRounded &&
      ctx.bezierCurveTo(x + k * rx, y + h, x, y + h - k * ry, x, y + h - ry);

    ctx.lineTo(x, y + ry);
    isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);

    ctx.closePath();
    ctx.stroke();
  },

  onSelect: function () {
    // need to destroy the group, to get to the textbox.
    this.destroy();
    let text = this.getObjects()[1];
    let rect = this.getObjects()[0];

    this.textRef = text;

    text.enterEditing();
    text.isEditing = true;

    // erase default text
    if (text.text === text.defaultText) {
      text.text = '';
      text.hiddenTextarea.value = '';
    }

    text.on('editing:exited', (e: any) => {
      // need to re-create the group, to get the textbox back into the group.
      // and add the group back to the canvas.
      this._styles.text = text.text;
      let group = new TextboxGroup(this._styles, this.canvas);
      this.canvas.add(group);
    });

    this.canvas.add(rect, text);
  },

  onDeselect: function (e: any) {
    // need this to hide the cursor. Can't be in text.on('editing:exited')
    this.textRef.exitEditing();
    this.textRef.isEditing = false;
  },
});
