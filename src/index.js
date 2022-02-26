import { pageActions, _domInit } from './core/kdom';
import { pageLoader } from './core/instance';
import { pageObjects } from './core/components';
import { _api, initialization, plugins } from './core/api';

const katharos = {
  pageActions: pageActions,
  pageLoader: pageLoader,
  pageObjects: pageObjects
};

const _dom = _domInit('test success');
console.log(_dom);
export { _dom, katharos, initialization };
