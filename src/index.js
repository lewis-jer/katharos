import { _api, plugins } from './core/api';
import { pageActions } from './core/kdom';
import { pageLoader } from './core/instance';

const katharos = {
  pageActions: new pageActions(_api).helper,
  pageLoader: pageLoader,
  _api: _api,
  configure: _api.system.configure.bind(_api.system)
};

export { katharos };
