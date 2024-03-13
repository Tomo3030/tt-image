export interface SceneConfig {
  backgroundPath: string;
  dzPath: string;
  textboxPath: string;
  assetContainerPath: string;
  numberOfDz: number;
  numberOfTextBoxes: number;
  requiredNumberOfElements: number;
  additionalElements?: number;
  requiredAssetProps: string[]; // ['name', 'email', 'phone', 'id'];
  assetPlacement: AssetPlacement[];
  dynamicAssetPlacement?: true; // if true, we shuffle the assetPlacement and cut it to requireNumberOfElements, so we will end up with a random ordered list of assetplacements (so not just 1,2,3,4,), and it cuts them so that some spots remain empty.
  additionalAssetScale: number; // most of the time 1, but if the asset sits too big in DZ, then scale it down/ acts as padding.
  styles?: {
    font?: {
      fontFamily: string;
      textAlign: string;
      textFill?: string;
      url: string;
      verticalCenterText?: boolean;
    };
    textbox?: {
      activeBorder?: string;
      borderRadius?: number;
    };
    canvas?: {
      lockedAssetRippleColor?: string;
    };
    dz?: {
      needsClipPath?: boolean;
      activeFill?: string;
      borderRadius?: number;
      active?: any;
      default?: any;
    };
  };
}

export interface AssetPlacement {
  [key: string]: string; //prop: where --> so path: dz-1 | name: textbox-1 | email: textbox-2 | phone: textbox-3 | id: textbox-4
}
