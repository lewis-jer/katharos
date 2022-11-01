import { plugins, assembler } from './plugin';
import { meta } from './meta';
import { pageObjects } from '../../core/components';
import { helper } from './helper';
import { gatherPageInfo, selectionController } from '../util';
import { initialization } from './init';
import { System } from './helper/system';
import { User } from './helper/user';
import { Store } from './helper/store';

const system = new System({
  name: 'system-reserved'
});

const user = new User({
  name: 'system-reserved'
});

const store = new Store({
  name: 'system-reserved'
});

const getDeviceType = () => {
  const ua = navigator.userAgent;
  const iPad =
    navigator.userAgent.match(/(iPad)/) /* iOS pre 13 */ ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); /* iPad OS 13 */
  if (iPad) {
    return 'tablet';
  }
  if (/(tablet|ipad|iPad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

let _api = {
  ...helper.dataHandler,
  ...helper.eventHandler,
  system: system,
  user: user,
  store: store,
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
