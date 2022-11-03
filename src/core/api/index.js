import { plugins, assembler, meta } from './plugin';
import { pageObjects } from '../../core/components';
import { helper } from './helper';
import { gatherPageInfo, selectionController, getDeviceType } from '../util';
import { initialization } from './init';
import { System } from './helper/system';

const system = new System({ name: 'system-reserved' });

let _api = {
  ...helper.dataHandler,
  ...helper.eventHandler,
  system: system,
  user: system.user,
  store: system.store,
  meta: meta
};

_api = {
  ..._api,
  ...pageObjects(_api),
  ...helper.tableMiddleware(_api),
  selectionController: selectionController(_api),
  gatherPageInfo: gatherPageInfo(_api)
};

_api = {
  ..._api,
  ...helper.modalMiddleware(_api),
  assembler: assembler(_api)
};

_api = {
  ..._api,
  ...new helper.formMiddleware(_api).helper,
  init: initialization(_api),
  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  getDeviceType: getDeviceType
};

window._katharos_api_ = _api;
window._katharos_system_ = system;

export { _api, plugins };
