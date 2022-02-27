import { loadPage } from './action-canvas';
import { gatherPageInfo } from './util';
import { _domObject } from './dom';

const pageActions = (_api) => {
  return {
    loadPage: loadPage(_api),
    gatherPageInfo: gatherPageInfo,
    loadIndex: 1
  };
};

const _domInit = (_api) => {
  return { ..._domObject(_api) };
};

export { pageActions, _domInit };
