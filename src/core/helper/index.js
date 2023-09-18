import { formHelperAction } from './hook-form.js';
import { dataHandler } from './hook-data.js';

const modalSync = (_api) => {
  return (modalFunc, form) => {
    for (var j in form.select) {
      var dataset = _api.user.getUserProfileData(form.datasets[j]);
      if ('sortedDatasets' in form && form.sortedDatasets)
        dataset = dataset?.sort((a, b) => (a[form.datasetsKey[j]] > b[form.datasetsKey[j]] ? 1 : -1));
      if ('datasetIndex' in form && form.datasetIndex.enabled) dataset = form.datasetIndex.callback(_api, dataset);
      for (var k in dataset) {
        var opt = dataset[k];
        var el = document.createElement('option');
        if (!Array.isArray(form.data)) {
          el.textContent = opt[form.data.label];
          el.value = opt[form.data.value];
          el.disabled = opt?.readonly || false;
          opt?.readonly && (el.style.fontWeight = 'bold');
        }
        if (Array.isArray(form.data)) {
          el.textContent = opt[form.data[j].label];
          el.value = opt[form.data[j].value];
          el.disabled = opt?.readonly || false;
          opt?.readonly && (el.style.fontWeight = 'bold');
        }
        document.getElementById(form.select[j]).appendChild(el);
      }
    }
  };
};

const helper = { dataHandler: dataHandler, formMiddleware: formHelperAction, modalSync: modalSync };
export { helper };
