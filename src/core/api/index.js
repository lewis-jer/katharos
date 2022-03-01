import { plugins } from './plugin';
import { pageObjects } from '../../core/components';
import {
  dataHandler,
  eventHandler,
  tableMiddleware,
  formMiddleware,
  modalMiddleware
} from './helper';
import { gatherPageInfo } from '../util';
import { initialization } from './init';

let _api = { ...dataHandler, ...eventHandler };
_api = {
  ..._api,
  ...pageObjects(_api),
  ...tableMiddleware(_api),
  gatherPageInfo: gatherPageInfo(_api)
};

_api = {
  ..._api,
  ...modalMiddleware(_api)
};

_api = {
  ..._api,
  ...formMiddleware(_api),
  init: initialization(_api)
};

window._katharos_api_ = _api;

export { _api, plugins };
