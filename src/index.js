import { _api } from './core/index.js';

const katharos = { _api: _api, configure: _api.system.configure.bind(_api.system) };

export { katharos };
