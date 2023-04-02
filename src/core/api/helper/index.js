import { tableMiddleware } from './hook-table.js';
import { formHelperAction } from './hook-form.js';
import { dataHandler } from './hook-data.js';

const event_log = (window.event_log = []);

const eventHandler = {
  addEvent: function (eventName, data) {
    var eventId = window.uuid();
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
  return (modalFunc, form) => {
    for (var j in form.select) {
      var select = document.getElementById(form.select[j]);
      var dataset = _api.user.getUserProfileData(form.datasets[j]);
      for (var k in dataset) {
        var opt = dataset[k];
        var el = document.createElement('option');
        if (!Array.isArray(form.data)) {
          el.textContent = opt[form.data.label];
          el.value = opt[form.data.value];
        }
        if (Array.isArray(form.data)) {
          el.textContent = opt[form.data[j].label];
          el.value = opt[form.data[j].value];
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
