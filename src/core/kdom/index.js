import { loadPage } from './action-canvas';

function pageActions(_api) {
  console.log('pageActions: ', this);
  return {
    loadPage: loadPage.call(this, _api),
    loadIndex: 1
  };
}
export { pageActions };
