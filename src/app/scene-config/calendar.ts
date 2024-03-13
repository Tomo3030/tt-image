import { SceneConfig } from '../modals/scene-config';

const config: SceneConfig = {
  backgroundPath: './assets/scenes/calendar/calendar-bg.svg',
  dzPath: '',
  textboxPath: './assets/scenes/calendar/calendar-textbox.svg',
  assetContainerPath: '',
  numberOfDz: 0,
  numberOfTextBoxes: 35,
  requiredNumberOfElements: 15,
  additionalElements: 0,
  requiredAssetProps: ['activity'],
  additionalAssetScale: 1,
  dynamicAssetPlacement: true,
  assetPlacement: [
    {
      activity: 'textbox-1',
    },
    {
      activity: 'textbox-2',
    },
    {
      activity: 'textbox-3',
    },
    {
      activity: 'textbox-4',
    },
    {
      activity: 'textbox-5',
    },
    {
      activity: 'textbox-6',
    },
    {
      activity: 'textbox-7',
    },
    {
      activity: 'textbox-8',
    },
    {
      activity: 'textbox-9',
    },
    {
      activity: 'textbox-10',
    },
    {
      activity: 'textbox-11',
    },
    {
      activity: 'textbox-12',
    },
    {
      activity: 'textbox-13',
    },
    {
      activity: 'textbox-14',
    },
    {
      activity: 'textbox-15',
    },
    {
      activity: 'textbox-16',
    },
    {
      activity: 'textbox-17',
    },
    {
      activity: 'textbox-18',
    },
    {
      activity: 'textbox-19',
    },
    {
      activity: 'textbox-20',
    },
    {
      activity: 'textbox-21',
    },
    {
      activity: 'textbox-22',
    },
    {
      activity: 'textbox-23',
    },
    {
      activity: 'textbox-24',
    },
    {
      activity: 'textbox-25',
    },
    {
      activity: 'textbox-26',
    },
    {
      activity: 'textbox-27',
    },
    {
      activity: 'textbox-28',
    },
    {
      activity: 'textbox-29',
    },
    {
      activity: 'textbox-30',
    },
    {
      activity: 'textbox-31',
    },
    {
      activity: 'textbox-32',
    },
    {
      activity: 'textbox-33',
    },
    {
      activity: 'textbox-34',
    },
    {
      activity: 'textbox-35',
    },
  ],
  styles: {
    font: {
      fontFamily: 'IBM Plex Sans Condensed',
      textFill: 'black',
      textAlign: 'center',
      url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed&display=swap',
      verticalCenterText: false,
    },
    textbox: {
      activeBorder: '#39A2AE',
      borderRadius: 4,
    },
    dz: {
      needsClipPath: false,
      activeFill: 'RGBA(0,0,255,0.1)',
    },
    canvas: {
      lockedAssetRippleColor: 'rgba(0,0,0,0.5)',
    },
  },
};

export default config;
