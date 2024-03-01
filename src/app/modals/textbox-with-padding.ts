import { fabric } from 'fabric';

export const TextboxWithPadding = fabric.util.createClass(fabric.Textbox, {
  _renderBackground: function (ctx: any) {
    if (!this.backgroundColor) {
      return;
    }

    const dim = this._getNonTransformedDimensions();
    const padding = (this.totalHeight! - this.height!) / 2;

    this.padding = padding;

    ctx.fillStyle = this.backgroundColor;

    ctx.fillRect(
      -dim.x / 2,
      -dim.y / 2 - this.padding,
      dim.x,
      dim.y + this.padding * 2
    );

    this._removeShadow(ctx);
  },

  _renderControls: function (ctx: any, styleOveride: any) {
    const originalTop = this.top;
    const originalPadding = this.padding;
    const originalHeight = this.height;
    this.padding = 0;
    this.top = originalTop - originalPadding;
    this.height = originalHeight + originalPadding * 2;

    this.callSuper('_renderControls', ctx, styleOveride);
    this.padding = originalPadding;
    this.top = originalTop;
    this.height = originalHeight;
  },

  //   onInput: function (e: any) {
  //     if (this.width < 214) {
  //       //console.log('less than 214');
  //     } else {
  //       this.text = this.text.slice(0, -1);
  //       this.hiddenTextarea.value = this.text;
  //       this.width = 213;
  //       //console.log('more than 214');
  //     }
  //     this.callSuper('onInput', e);
  //   },

  onSelect() {
    if (!this.editable) return;
    this._handleTextboxText();
    this.backgroundColor = this.selectedBackgroundColor; //magic
    this.dirty = true;
  },

  onDeselect(e: any) {
    this.backgroundColor = this.defaultBg;
    this.exitEditing();
    this.isEditing = false;
    if (this.text === '') {
      this.text = this.defaultText;
    }
    this.dirty = true;
  },

  _handleTextboxText() {
    if (!this.editable) return;
    this.enterEditing();
    this.isEditing = true;
    if (this.text === this.defaultText) {
      this.text = '';
      this.hiddenTextarea.value = '';
    }
  },

  _handleTextboxAnimation() {
    let fill = this.editable ? '#03A9F4' : 'red'; //magic
    let rect = new fabric.Rect({
      left: this.left! + this.width! / 2,
      top: this.top! - this.padding,
      width: this.width! + 6,
      height: this.height! + this.padding * 2,
      scaleX: 0.01,
      opacity: 0.5,
      originX: 'center',
      fill: fill,
      selectable: false,
    });
    this.canvas.add(rect);

    rect.animate('scaleX', 1, {
      duration: 100,
      onChange: this.canvas.renderAll.bind(this.canvas),
    });

    rect.animate('opacity', 0, {
      duration: 300,
      onChange: this.canvas.renderAll.bind(this.canvas),
      onComplete: () => {
        this.canvas.remove(rect);
        this.selected = true;
      },
    });

    rect.animate;
  },
});
