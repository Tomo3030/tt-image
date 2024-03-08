import { SceneConfig } from '../modals/scene-config';

const config: SceneConfig = {
  backgroundPath: './assets/scenes/supermarket/supermarket-bg.svg',
  dzPath: './assets/scenes/supermarket/supermarket-dz.svg',
  textboxPath: './assets/scenes/supermarket/supermarket-textboxes.svg',
  assetContainerPath:
    './assets/scenes/supermarket/supermarket-asset-container.svg',
  numberOfDz: 9,
  numberOfTextBoxes: 9,
  numberOfAssets: 9,
  additionalAssetScale: 0.7,
  requiredAssetProps: ['dollar_price'],
  assetPlacement: [
    {
      path: 'dz-1',
      dollar_price: 'textbox-1',
    },
    {
      path: 'dz-2',
      dollar_price: 'textbox-2',
    },
    {
      path: 'dz-3',
      dollar_price: 'textbox-3',
    },
    {
      path: 'dz-4',
      dollar_price: 'textbox-4',
    },
    {
      path: 'dz-5',
      dollar_price: 'textbox-5',
    },
    {
      path: 'dz-6',
      dollar_price: 'textbox-6',
    },
    {
      path: 'dz-7',
      dollar_price: 'textbox-7',
    },
    {
      path: 'dz-8',
      dollar_price: 'textbox-8',
    },
    {
      path: 'dz-9',
      dollar_price: 'textbox-9',
    },
  ],
  styles: {
    font: {
      fontFamily: 'Montserrat',
      textAlign: 'center',
      textFill: 'white',
      url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap',
      verticalCenterText: true,
    },
    textbox: {
      activeBorder: 'RGBA(70,57,50,.70)',
      borderRadius: 4,
    },
    dz: {
      needsClipPath: false,
      borderRadius: 4,
      activeFill: 'RGBA(254,208,45,.30)',
    },
    canvas: {},
  },
};

export default config;
