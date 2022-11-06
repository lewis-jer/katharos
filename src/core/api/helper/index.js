import { tableMiddleware } from './hook-table.js';
import { formHelperAction } from './hook-form.js';
import { dataHandler } from './hook-data.js';

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

const modalSync = (_api) => {
  return (modalFunc, modalName) => {
    var modal = _api.system.getModal(modalName);
    for (var j in modal.select) {
      var select = document.getElementById(modal.select[j]);
      var dataset = _api.user.getUserProfileData(modal.datasets[j]);
      for (var k in dataset) {
        var opt = dataset[k];
        var el = document.createElement('option');
        if (!Array.isArray(modal.data)) {
          el.textContent = opt[modal.data.label];
          el.value = opt[modal.data.value];
        }
        if (Array.isArray(modal.data)) {
          el.textContent = opt[modal.data[j].label];
          el.value = opt[modal.data[j].value];
        }
        select.appendChild(el);
      }
    }
  };
};

const helper = {
  dataHandler: dataHandler,
  eventHandler: eventHandler,
  tableMiddleware: tableMiddleware,
  formMiddleware: formHelperAction,
  modalSync: modalSync
};

export { helper };
