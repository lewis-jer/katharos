const gatherPageInfo = (_api) => {
  return (pageName) => {
    return _api.system.getModule(pageName);
  };
};

const selectionController = (_api) => {
  return (x, y = '', z = '') => {
    var control = _api.system.getController(x);
    let { a, b } = control(y, z);
    return {
      a,
      b
    };
  };
};

export { gatherPageInfo, selectionController };
