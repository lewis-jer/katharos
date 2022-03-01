import { pageActions } from './core/kdom';
import { pageLoader } from './core/instance';
import { _api, initialization, plugins } from './core/api';

const katharos = {
  pageActions: pageActions(_api),
  pageLoader: pageLoader,
  _api: _api
};

export { katharos, initialization };
