import { plugins, assembler } from './plugin';
import { pageObjects } from '../../core/components';
import { helper } from './helper';
import { gatherPageInfo } from '../util';
import { initialization } from './init';
import { System } from './helper/class';

const system = new System({
  name: 'system-reserved'
});

console.log(system);

let _api = { ...helper.dataHandler, ...helper.eventHandler, ...system };
_api = {
  ..._api,
  ...pageObjects(_api),
  ...helper.tableMiddleware(_api),
  gatherPageInfo: gatherPageInfo(_api)
};

_api = {
  ..._api,
  ...helper.modalMiddleware(_api),
  assembler: assembler(_api)
};

_api = {
  ..._api,
  ...helper.formMiddleware(_api),
  init: initialization(_api)
};

window._katharos_api_ = _api;
window._katharos_system_ = System;

export { _api, plugins };
