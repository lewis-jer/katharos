const gatherPageInfo = (_api) => {
  return (pageName) => {
    return arrayFunctions.arrayToObject(modulePath)[pageName];
  };
};

export { gatherPageInfo };
