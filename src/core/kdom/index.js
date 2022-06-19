import { loadPage } from './action-canvas';

const pageActions = (_api) => {
  console.log('pageActions: ', this);
  return {
    loadPage: loadPage(_api),
    loadIndex: 1
  };
};
export { pageActions };
