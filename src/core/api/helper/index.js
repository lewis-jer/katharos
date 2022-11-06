import { tableMiddleware } from './hook-table';
import { formHelperAction } from './hook-form';
import { modalMiddleware } from './hook-modal';
import { dataHandler } from './hook-data';

const event_log = (window.event_log = []);

const eventHandler = {
  addEvent: function (eventName, data) {
    var eventId = uuid();
    event_log.push({
      detail: JSON.stringify(data),
      arrayExpression: eventId,
      id: eventId,
      identifier: eventName,
      location: document.location.href,
      timestamp: Date.now()
    });
    return true;
  },
  removeEvent: function (objectId, systemReserved, formAction, modalName) {}
};

const helper = {
  dataHandler: dataHandler,
  eventHandler: eventHandler,
  tableMiddleware: tableMiddleware,
  formMiddleware: formHelperAction,
  modalMiddleware: modalMiddleware
};

export { helper };
