import { pageActions } from './core/kdom';
import { pageLoader } from './core/instance';
import { _api, plugins } from './core/api';

const katharos = {
  pageActions: pageActions(_api),
  pageLoader: pageLoader,
  _api: _api
};

global.test = 'test success';

export { katharos };
