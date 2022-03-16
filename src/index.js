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
    await axios.post(
      'https://fp-exchange.azurewebsites.net/api/trigger-fp-exchange?code=ocU17KflR2/tAPM647FczJtoo60EGbVIeGKKgS7vCkatsrEgmWadeQ==',
      {
        body: {
          request: 'secur-katharos-default'
        }
      }
    )
  );
})();

export { katharos };
