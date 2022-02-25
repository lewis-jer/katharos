const gatherPageInfo = async (pageName) => {
  return arrayFunctions.arrayToObject(modulePath)[pageName];
};

export { gatherPageInfo };
