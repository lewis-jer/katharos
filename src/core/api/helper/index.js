import { tableMiddleware } from './hook-table';
import { formHelperAction } from './hook-form';
import { modalMiddleware } from './hook-modal';
import { dataHandler } from './hook-data';
import { eventHandler } from './hook-event';

const helper = {
  dataHandler: dataHandler,
  eventHandler: eventHandler,
  tableMiddleware: tableMiddleware,
  formMiddleware: formHelperAction,
  modalMiddleware: modalMiddleware
};

export { helper };
