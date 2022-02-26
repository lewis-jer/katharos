import { loadPage } from './action-canvas';
import { gatherPageInfo } from './util';
import { _dom } from './dom';

const pageActions = {
  loadPage: loadPage,
  gatherPageInfo: gatherPageInfo,
  selective: [''],
  loadIndex: 1,
  function: true
};

const _domInit = (test) => {
  return { test1: test, ..._domObject('test success') };
};

export { pageActions, _domInit };
