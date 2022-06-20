import { drawPage, dynamicTableDestructor, pageDestructor } from './render.js';

async function generatePage(pageName, pageInfo) {
  await drawPage.call(this, pageName, pageInfo);
}

async function clearPage(pageInfo) {
  await dynamicTableDestructor.call(this, pageInfo);
  await pageDestructor.call(this, pageInfo);
}

export { generatePage, clearPage };
