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

const getDeviceType = () => {
  const ua = navigator.userAgent;
  const iPad =
    navigator.userAgent.match(/(iPad)/) /* iOS pre 13 */ ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); /* iPad OS 13 */
  if (iPad) {
    return 'tablet';
  }
  if (/(tablet|ipad|iPad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

export { gatherPageInfo, selectionController, getDeviceType };
