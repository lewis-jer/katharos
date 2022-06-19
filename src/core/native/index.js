import { drawPage, dynamicTableDestructor, pageDestructor } from './render.js';

const generate = (_api) => {
  console.log('generate: ', this);
  return async (pageName, pageInfo) => {
    await drawPage(pageName, pageInfo, _api);
  };
};

const clearPage = async (_api, pageInfo) => {
  console.log('clearPage', this);
  await dynamicTableDestructor(_api, pageInfo);
  await pageDestructor(pageInfo);
};

export { generate, clearPage };
