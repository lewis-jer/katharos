import { plugins } from './plugin';
import { pageObjects } from '../../core/components';
import { helper } from './helper';
import { gatherPageInfo } from '../util';
import { initialization } from './init';

let _api = { ...helper.dataHandler, ...helper.eventHandler };
_api = {
  ..._api,
  ...pageObjects(_api),
  ...helper.tableMiddleware(_api),
  gatherPageInfo: gatherPageInfo(_api)
};

_api = {
  ..._api,
  ...helper.modalMiddleware(_api)
};

_api = {
  ..._api,
  ...helper.formMiddleware(_api),
  init: initialization(_api)
};

window._katharos_api_ = _api;

export { _api, plugins };
