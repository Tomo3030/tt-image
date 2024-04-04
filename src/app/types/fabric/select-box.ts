import { fabric } from 'fabric';

export const SelectBox = fabric.util.createClass(fabric.Rect, {
  type: 'selectbox',
  initialize: function (options: any) {
    this.callSuper('initialize', options);
    this.set({
      id: options.id,
      type: 'selectbox',
      selected: false,
      selectable: false,
    });
  },
});
