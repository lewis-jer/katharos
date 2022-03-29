const gatherPageInfo = (_api) => {
  return (pageName) => {
    return _api.arrayToObject(modulePath)[pageName];
  };
};

const selectionController = (x, y = '', z = '') => {
  var control = controller[x];
  let { a, b } = control(y, z);
  return {
    a,
    b
  };
};

export { gatherPageInfo, selectionController };
