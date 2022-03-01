import { loadPage } from './action-canvas';

const pageActions = (_api) => {
  return {
    loadPage: loadPage(_api),
    loadIndex: 1
  };
};
window._api;
export { pageActions };
