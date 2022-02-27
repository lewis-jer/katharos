import { loadPage } from './action-canvas';
import { gatherPageInfo } from './util';
import { _domObject } from './dom';

const pageActions = (_api) => {
  return {
    loadPage: loadPage(),
    gatherPageInfo: gatherPageInfo
  };
};

const _domInit = (_api) => {
  return { ..._domObject(_api) };
};

export { pageActions, _domInit };
