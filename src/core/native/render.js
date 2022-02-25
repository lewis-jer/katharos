const generatePage = async (pageName, pageInfo) => {
  await pageMiddleware.drawPage(pageName, pageInfo);
};

export { generatePage };
