import { loadPage } from './action-canvas';

function pageActions(_api) {
  console.log('pageActions: ', this);
  console.log('pageActions: ', _api);
  return {
    loadPage: loadPage(_api),
    loadIndex: 1
  };
}
export { pageActions };
