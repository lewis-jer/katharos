import { loadPage } from './action-canvas';

function pageActions(_api) {
  this.helper = {
    loadPage: loadPage(_api),
    loadIndex: 1
  };
}
export { pageActions };
