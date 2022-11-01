import { _api, plugins } from './core/api';
import { pageActions } from './core/kdom';

const katharos = {
  pageActions: new pageActions(_api).helper,
  _api: _api,
  configure: _api.system.configure.bind(_api.system)
};

export { katharos };
