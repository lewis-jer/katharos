import { formMiddleware } from '../api/helper/hook-form';
import { modalMiddleware } from '../api/helper/hook-modal';
import { tableMiddleware } from '../api/helper/hook-table';

const _dom = (_api) => {
  console.log(_api);
  console.log(`_______________________________________________________`);
  return {
    ...tableMiddleware(_api),
    ...formMiddleware(_api),
    modalMiddleware: modalMiddleware(_api)
  };
};

export { _dom as _domObject };
