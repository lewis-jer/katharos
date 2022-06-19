import { pageActions } from './core/kdom';
import { pageLoader } from './core/instance';
import { _api, plugins } from './core/api';

const katharos = {
  pageActions: pageActions.call(_api, _api),
  pageLoader: pageLoader,
  _api: _api,
  configure: _api.system.configure.bind(_api.system)
};

console.log(katharos);

export { katharos };
