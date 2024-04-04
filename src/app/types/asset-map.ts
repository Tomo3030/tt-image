export interface AssetMap {
  collection: string;
  'base-path': string;
  size: { height: number; width: number };
  tags?: string[];
  assets: {
    [key: string]: {
      assetName: string;
      [prop: string]: any;
    };
  };
}
