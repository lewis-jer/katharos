import { plugins, assembler } from './plugin';
import { pageObjects } from '../../core/components';
import { helper } from './helper';
import { gatherPageInfo } from '../util';
import { initialization } from './init';

let _api = { ...helper.dataHandler, ...helper.eventHandler, pluginIndex: 0 };
_api = {
  ..._api,
  ...pageObjects(_api),
  ...helper.tableMiddleware(_api),
  gatherPageInfo: gatherPageInfo(_api)
};
console.log(_api.pluginIndex);

_api = {
  ..._api,
  ...helper.modalMiddleware(_api),
  assembler: assembler(_api)
};
console.log(_api.pluginIndex);

_api = {
  ..._api,
  ...helper.formMiddleware(_api),
  init: initialization(_api)
};
console.log(_api.pluginIndex);

window._katharos_api_ = _api;

export { _api, plugins };
