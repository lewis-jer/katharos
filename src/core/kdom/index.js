import { loadPage } from './action-canvas';

function pageActions(_api) {
  this.helper = {
    loadPage(_api) {
      return loadPage(_api);
    },
    loadIndex: 1
  };
}
export { pageActions };
