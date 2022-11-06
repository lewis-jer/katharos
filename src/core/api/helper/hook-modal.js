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

const modalMiddleware = (_api) => {
  return {
    modalSync: modalSync(_api)
  };
};

export { modalMiddleware };
