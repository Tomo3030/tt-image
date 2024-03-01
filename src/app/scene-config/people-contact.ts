import { SceneConfig } from '../modals/scene-config';

export const config: SceneConfig = {
  backgroundPath: './assets/scenes/people-contact/people-bg.svg',
  dzPath: './assets/scenes/people-contact/people-dz.svg',
  textboxPath: './assets/scenes/people-contact/people-textbox.svg',
  assetContainerPath: './assets/scenes/people-contact/asset-container.svg',
  numberOfDz: 4,
  numberOfTextBoxes: 16,
  numberOfAssets: 5,
  requiredAssetProps: ['name', 'email', 'phone', 'id'],
  assetPlacement: [
    {
      path: 'dz-1',
      name: 'textbox-1',
      phone: 'textbox-2',
      email: 'textbox-3',
      id: 'textbox-4',
    },

    {
      path: 'dz-2',
      name: 'textbox-5',
      phone: 'textbox-6',
      email: 'textbox-7',
      id: 'textbox-8',
    },

    {
      path: 'dz-3',
      name: 'textbox-9',
      phone: 'textbox-10',
      email: 'textbox-11',
      id: 'textbox-12',
    },

    {
      path: 'dz-4',
      name: 'textbox-13',
      phone: 'textbox-14',
      email: 'textbox-15',
      id: 'textbox-16',
    },
  ],

  styles: {
    textbox: {
      fontFamily: 'Arial',
      fontUrl:
        'https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap',
      selectedBackgroundColor: 'RGBA(0,0,255,0.1)',
      fill: 'black', //text color
    },
    dz: {
      needsClipPath: true,
      activeFill: 'RGBA(0,0,255,0.1)',
    },
    canvas: {
      lockedAssetRippleColor: 'rgba(0,0,0,0.5)',
    },
  },
};

// dzAssociations: [
//   {
//     dzId: 'dz-1',
//     associatedTextBoxes: [
//       { id: 'textbox-1', prop: 'name' },
//       { id: 'textbox-2', prop: 'email' },
//       { id: 'textbox-3', prop: 'phone' },
//       { id: 'textbox-4', prop: 'studentId' },
//     ],
//   },
//   {
//     dzId: 'dz-2',
//     associatedTextBoxes: [
//       { id: 'textbox-5', prop: 'name' },
//       { id: 'textbox-6', prop: 'email' },
//       { id: 'textbox-7', prop: 'phone' },
//       { id: 'textbox-8', prop: 'studentId' },
//     ],
//   },
//   {
//     dzId: 'dz-3',
//     associatedTextBoxes: [
//       { id: 'textbox-9', prop: 'name' },
//       { id: 'textbox-10', prop: 'email' },
//       { id: 'textbox-11', prop: 'phone' },
//       { id: 'textbox-12', prop: 'studentId' },
//     ],
//   },
//   {
//     dzId: 'dz-4',
//     associatedTextBoxes: [
//       { id: 'textbox-13', prop: 'name' },
//       { id: 'textbox-14', prop: 'email' },
//       { id: 'textbox-15', prop: 'phone' },
//       { id: 'textbox-16', prop: 'studentId' },
//     ],
//   },
// ],
