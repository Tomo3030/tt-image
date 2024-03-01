export interface SceneConfig {
  backgroundPath: string;
  dzPath: string;
  textboxPath: string;
  assetContainerPath: string;
  numberOfDz: number;
  numberOfTextBoxes: number;
  numberOfAssets: number;
  requiredAssetProps: string[]; // ['name', 'email', 'phone', 'id'];
  assetPlacement: AssetPlacement[];
  styles?: {
    textbox?: {
      fontFamily: string;
      fontUrl: string;
      selectedBackgroundColor: string;
      fill: string;
    };
    canvas?: {
      lockedAssetRippleColor: string;
    };
    dz?: {
      needsClipPath: boolean;
      activeFill: string;
    };
  };
}

export interface DZAssociation {
  dzId: string;
  associatedTextBoxes: { id: string; prop: string }[];
}

export interface AssetPlacement {
  [key: string]: string; //prop: where --> so path: dz-1 | name: textbox-1 | email: textbox-2 | phone: textbox-3 | id: textbox-4
}
