const generatePage = async (pageName, pageInfo) => {
  console.log(pageName);
  console.log(pageInfo);
  await pageMiddleware.drawPage(pageName, pageInfo);
};

export { generatePage };
