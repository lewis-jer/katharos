const selectionController =
  (_api) =>
  (x, y = '', z = '') => {
    var { a, b } = _api.system.getController(x)(y, z);
    return { a, b };
  };

const getDeviceType = () => {
  const ua = navigator.userAgent;
  const iPad = navigator.userAgent.match(/(iPad)/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (iPad) return 'tablet';
  if (/(tablet|ipad|iPad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
  return 'desktop';
};

export { selectionController, getDeviceType };
