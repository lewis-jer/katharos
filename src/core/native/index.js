import { drawPage, dynamicTableDestructor, pageDestructor } from "./render.js";

const generatePage = async (pageName, pageInfo) => {
  await drawPage(pageName, pageInfo);
};

const clearPage = async (pageInfo) => {
  await dynamicTableDestructor(pageInfo);
  await pageDestructor(pageInfo);
};

export { generatePage, clearPage };
