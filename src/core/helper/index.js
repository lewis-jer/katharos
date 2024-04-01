import { dataHandler } from './hook-data.js';

const modalSync = (_api) => {
  return (modalFunc, form) => {
    if (modalFunc == 'advanced') form = form.advanced;
    let { data, datasets, datasetIndex, datasetsKey, select, sortedDatasets } = form;
    for (var j in select) {
      function cleanCode(codeString) {
        return codeString.trim().replace(/\s*\n\s*/g, ' ');
      }
      var dataset = _api.user.getUserProfileData(datasets[j]);
      if ('sortedDatasets' in form && sortedDatasets) dataset = dataset?.sort((a, b) => (a[datasetsKey[j]] > b[datasetsKey[j]] ? 1 : -1));
      if ('datasetIndex' in form && datasetIndex.enabled) {
        if (typeof datasetIndex.callback === 'string') {
          const callbackStr = cleanCode(datasetIndex.callback);
          const callbackFn = new Function('return ' + callbackStr)();
          dataset = callbackFn(_api, dataset);
        } else {
          dataset = datasetIndex.callback(_api, dataset);
        }
      }
      for (var k in dataset) {
        var opt = dataset[k];
        var el = document.createElement('option');
        if (!Array.isArray(data)) {
          el.textContent = opt[data.label];
          el.value = opt[data.value];
          el.disabled = opt?.readonly || false;
          opt?.readonly && (el.style.fontWeight = 'bold');
        }
        if (Array.isArray(data)) {
          el.textContent = opt[data[j].label];
          el.value = opt[data[j].value];
          el.disabled = opt?.readonly || false;
          opt?.readonly && (el.style.fontWeight = 'bold');
        }
        document.getElementById(select[j]).appendChild(el);
      }
    }
  };
};

const helper = { dataHandler: dataHandler, modalSync: modalSync };
export { helper };
