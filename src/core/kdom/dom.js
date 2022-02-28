import { formMiddleware } from './instance/hook-form';
import { modalMiddleware } from './instance/hook-modal';
import { tableMiddleware } from '../api/helper/hook-table';

const _dom = (_api) => {
  return {
    ...tableMiddleware(_api),
    ...formMiddleware(_api),
    modalMiddleware: modalMiddleware(_api)
  };
};

export { _dom as _domObject };
