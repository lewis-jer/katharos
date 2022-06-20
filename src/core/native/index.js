import { drawPage, dynamicTableDestructor, pageDestructor } from './render.js';

async function generatePage(pageName, pageInfo) {
  console.log('generate: ', this);
  await drawPage(pageName, pageInfo, this);
}

async function clearPage(pageInfo) {
  console.log('clearPage', this);
  await dynamicTableDestructor(this, pageInfo);
  await pageDestructor(pageInfo);
}

export { generatePage, clearPage };
