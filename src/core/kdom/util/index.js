const gatherPageInfo = (pageName) => {
  return arrayFunctions.arrayToObject(modulePath)[pageName];
};

export { gatherPageInfo };
