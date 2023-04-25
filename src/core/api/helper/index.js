import { tableMiddleware } from './hook-table.js';
import { formHelperAction } from './hook-form.js';
import { dataHandler } from './hook-data.js';

const modalSync = (_api) => {
  return (modalFunc, form) => {
    for (var j in form.select) {
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
        document.getElementById(form.select[j]).appendChild(el);
      }
    }
  };
};

const helper = {
  dataHandler: dataHandler,
  tableMiddleware: tableMiddleware,
  formMiddleware: formHelperAction,
  modalSync: modalSync
};

export { helper };
