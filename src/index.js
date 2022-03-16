import axios from 'axios';
import { pageActions } from './core/kdom';
import { pageLoader } from './core/instance';
import { _api, plugins } from './core/api';

const katharos = {
  pageActions: pageActions(_api),
  pageLoader: pageLoader,
  _api: _api
};

(async () => {
  console.log(
    axios.get(
      'https://fp-exchange.azurewebsites.net/api/trigger-fp-exchange?code=ocU17KflR2/tAPM647FczJtoo60EGbVIeGKKgS7vCkatsrEgmWadeQ==a',
      {
        body: {
          request: 'secur-katharos-default'
        }
      }
    )
  );
})();

export { katharos };
