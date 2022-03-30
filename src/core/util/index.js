const gatherPageInfo = (_api) => {
  return (pageName) => {
    return _api.arrayToObject(modulePath)[pageName];
  };
};

const selectionController = (_api) => {
  return (x, y = '', z = '') => {
    var control = _api.system.getController(x);
    console.log(control);
    let { a, b } = control(y, z);
    return {
      a,
      b
    };
  };
};

export { gatherPageInfo, selectionController };
