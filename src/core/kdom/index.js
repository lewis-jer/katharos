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

const _dom = {
  ..._dom()
};

export { pageActions, _dom };
