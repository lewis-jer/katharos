import { pageActions, _domInit } from './core/kdom';
import { pageLoader } from './core/instance';
import { pageObjects } from './core/components';
import { _api, initialization, plugins } from './core/api';

const katharos = {
  pageActions: pageActions,
  pageLoader: pageLoader,
  pageObjects: pageObjects,
  ..._api
};

const _dom = _domInit(_api);

export { _dom, katharos, initialization };
