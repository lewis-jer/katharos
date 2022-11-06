import { _api, plugins } from './core/api/index.js';
import { pageActions } from './core/kdom/index.js';

const katharos = {
  _api: _api,
  pageActions: new pageActions(_api).helper,
  configure: _api.system.configure.bind(_api.system)
};

export { katharos };
