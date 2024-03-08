import { SceneConfig } from '../modals/scene-config';

const config: SceneConfig = {
  backgroundPath: './assets/scenes/people-contact/people-bg.svg',
  dzPath: './assets/scenes/people-contact/people-dz.svg',
  textboxPath: './assets/scenes/people-contact/people-textbox.svg',
  assetContainerPath: './assets/scenes/people-contact/asset-container.svg',
  numberOfDz: 4,
  numberOfTextBoxes: 16,
  numberOfAssets: 5,
  requiredAssetProps: ['name', 'email', 'phone', 'id'],
  additionalAssetScale: 1,
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
    font: {
      fontFamily: 'Montserrat',
      textAlign: 'center',
      url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap',
      verticalCenterText: true,
      textFill: 'black',
    },
    textbox: {
      activeBorder: 'RGBA(0,0,255,0.1)',
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

export default config;
