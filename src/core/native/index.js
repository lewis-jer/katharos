import { drawPage, dynamicTableDestructor, pageDestructor } from './render.js';

async function generatePage(pageName, pageInfo) {
  console.log('generate: ', this);
  await drawPage.call(this, pageName, pageInfo);
}

async function clearPage(pageInfo) {
  console.log('clearPage', this);
  await dynamicTableDestructor.call(this, pageInfo);
  await pageDestructor.call(this, pageInfo);
}

export { generatePage, clearPage };
