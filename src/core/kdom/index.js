import { loadPage } from './action-canvas';
import { _domObject } from './dom';

const pageActions = (_api) => {
  return {
    loadPage: loadPage(_api),
    loadIndex: 1
  };
};

const _domInit = (_api) => {
  return { ..._domObject(_api) };
};

export { pageActions, _domInit };
