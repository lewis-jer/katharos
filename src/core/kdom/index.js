import { loadPage } from './action-canvas';

function pageActions(_api) {
  console.log(this);
  return {
    loadPage: loadPage(_api),
    loadIndex: 1
  };
}
export { pageActions };
