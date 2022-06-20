import { plugins, assembler } from './plugin';
import { meta } from './meta';
import { pageObjects } from '../../core/components';
import { helper } from './helper';
import { gatherPageInfo, selectionController } from '../util';
import { initialization } from './init';
import { System } from './helper/class';
import { User } from './helper/user';
import { Store } from './helper/store';
import { pageLoader } from '../instance';

const system = new System({
  name: 'system-reserved'
});

const user = new User({
  name: 'system-reserved'
});

const store = new Store({
  name: 'system-reserved'
});

console.log(system);
console.log(user);
console.log(store);

let _api = {
  ...helper.dataHandler,
  ...helper.eventHandler,
  loader: pageLoader,
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
  }
};

window._katharos_api_ = _api;
window._katharos_system_ = system;

export { _api, plugins };
