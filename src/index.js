import { v4 as uuidv4 } from 'uuid';
import { pageActions } from './core/kdom';
import { pageLoader } from './core/instance';
import { _api, plugins } from './core/api';

const katharos = {
  pageActions: pageActions(_api),
  pageLoader: pageLoader,
  _api: _api
};

console.log(uuidv4());

export { katharos };
