interface AssetMapImports {
  [key: string]: () => Promise<any>;
}

export const assetMapImports: AssetMapImports = {
  'avatar-men': () => import('./avatar-men'),
  fruits: () => import('./fruits'),
};
