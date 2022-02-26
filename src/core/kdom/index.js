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

const _dom = {
  ..._domObject('test success')
};

export { pageActions, _dom };
