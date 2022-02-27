import { pageActions, _domInit } from './core/kdom';
import { pageLoader } from './core/instance';
import { pageObjects } from './core/components';
import { _api, initialization, plugins } from './core/api';

const katharos = {
  pageActions: pageActions(_api),
  pageLoader: pageLoader,
  pageObjects: pageObjects,
  _api: _api
};

const _dom = _domInit(_api);

export { _dom, katharos, initialization };
