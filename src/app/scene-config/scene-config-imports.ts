interface SceneConfigImports {
  [key: string]: () => Promise<any>;
}

export const sceneConfigImports: SceneConfigImports = {
  'people-contact': () => import('./people-contact'),
  supermarket: () => import('./supermarket'),
  calendar: () => import('./calendar'),
};
