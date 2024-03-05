interface SceneConfigImports {
  [key: string]: () => Promise<any>;
}

export const sceneConfigImports: SceneConfigImports = {
  'people-contacts': () => import('./people-contact'),
  supermarket: () => import('./supermarket'),
};
