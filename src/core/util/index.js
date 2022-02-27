const gatherPageInfo = (_api) => {
  return (pageName) => {
    return _api.arrayToObject(modulePath)[pageName];
  };
};

export { gatherPageInfo };
