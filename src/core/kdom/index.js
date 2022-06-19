import { loadPage } from './action-canvas';

function pageActions(_api) {
  this.helper = {
    loadPage: loadPage.call(_api),
    loadIndex: 1
  };
}
export { pageActions };
