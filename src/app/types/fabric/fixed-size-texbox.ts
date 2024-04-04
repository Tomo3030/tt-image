import { fabric } from 'fabric';

export const FixedSizedTextbox = fabric.util.createClass(fabric.Textbox, {
  type: 'fixedSizedTextbox',
  initialize: function (text: string, styles: any) {
    this.callSuper('initialize', text, styles);
  },
  onInput: function (e: any) {
    if (e.inputType === 'insertLineBreak') return;

    if (this.width > this.maxWidth) {
      this.text = this.text.slice(0, -1);
      this.hiddenTextarea.value = this.text;
      this.width = this.maxWidth;
      return;
    }

    if (this.height > this.maxHeight) {
      console.log('height exceeded');
      this.text = this.text.slice(0, -1);
      this.hiddenTextarea.value = this.text;
      this.height = this.maxHeight;
      this.canvas.discardActiveObject();
      this.isEditing = false;
    }

    console.log(e);
    this.callSuper('onInput', e);
  },
});
