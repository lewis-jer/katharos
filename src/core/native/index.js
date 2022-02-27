import { drawPage, dynamicTableDestructor, pageDestructor } from './render.js';

const generate = (_api) => {
  return async (pageName, pageInfo) => {
    await drawPage(pageName, pageInfo);
  };
};

const clearPage = async (pageInfo) => {
  await dynamicTableDestructor(pageInfo);
  await pageDestructor(pageInfo);
};

export { generate, clearPage };
