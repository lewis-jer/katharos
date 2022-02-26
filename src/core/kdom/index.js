import { loadPage } from './action-canvas';
import { gatherPageInfo } from './util';
import { _domObject } from './dom';

const pageActions = {
  loadPage: loadPage,
  gatherPageInfo: gatherPageInfo,
  selective: [''],
  loadIndex: 1,
  function: true
};

const _domInit = (_api) => {
  return { ..._domObject(_api) };
};

export { pageActions, _domInit };
