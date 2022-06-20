import { pageActions } from './core/kdom';
import { pageLoader } from './core/instance';
import { _api, plugins } from './core/api';

const katharos = {
  pageActions: new pageActions(_api).helper,
  pageLoader: pageLoader,
  _api: _api,
  configure: _api.system.configure.bind(_api.system),
  user: _api.user.configure.bind(_api.user)
};

export { katharos };
