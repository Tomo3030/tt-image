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
  scale: number; // most of the time 1, but if the asset sits too big in DZ, then scale it down.
  styles?: {
    textbox?: {
      fontFamily?: string;
      fontUrl?: string;
      selectedBackgroundColor?: string;
      fill?: string;
      borderRadius?: number;
    };
    canvas?: {
      lockedAssetRippleColor?: string;
    };
    dz?: {
      needsClipPath?: boolean;
      activeFill?: string;
      borderRadius?: number;
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
