import { fabric } from 'fabric';
export const DropBox = fabric.util.createClass(fabric.Rect, {
  initialize: function (options: any) {
    if (!options.id) throw new Error('DropBox must have an id');
    this.callSuper('initialize', options);
    this.set({
      id: options.id,
      type: 'dropbox',
      isEmpty: true,
      activeStyles: options.activeStyles,
      defaultStyles: options.defaultStyles,
      selectable: false,
      rx: options.borderRadius || 0,
      ry: options.borderRadius || 0,
      ...options.defaultStyles,
    });
  },
});
