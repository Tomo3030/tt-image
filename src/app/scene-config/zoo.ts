import { SceneConfig } from '../types/scene-config';

const config: SceneConfig = {
  backgroundPath: './assets/scenes/zoo/zoo-bg.svg',
  dzPath: './assets/scenes/zoo/zoo-dz.svg',
  textboxPath: '',
  assetContainerPath: './assets/scenes/zoo/zoo-asset-container.svg',
  numberOfDz: 13,
  numberOfTextBoxes: 0,
  requiredNumberOfElements: 13,
  additionalElements: 1,
  requiredAssetProps: [],
  additionalAssetScale: 1,
  backgroundFill: '#147D49',
  assetPlacement: [
    {
      path: 'dz-1',
    },
    {
      path: 'dz-2',
    },
    {
      path: 'dz-3',
    },
    {
      path: 'dz-4',
    },
    {
      path: 'dz-5',
    },
    {
      path: 'dz-6',
    },
    {
      path: 'dz-7',
    },
    {
      path: 'dz-8',
    },
    {
      path: 'dz-9',
    },
    {
      path: 'dz-10',
    },
    {
      path: 'dz-11',
    },
    {
      path: 'dz-12',
    },
    {
      path: 'dz-13',
    },
  ],

  styles: {
    dz: {
      borderRadius: 6,
      activeStyles: {
        stroke: '#EB6424',
        //stroke: '#2374AB',
        strokeWidth: 2,
      },
      defaultStyles: {
        stroke: null,
        strokeWidth: 0,
      },
    },
    canvas: {
      lockedAssetRippleColor: 'rgba(0,0,0,0.5)',
    },
  },
};

export default config;
