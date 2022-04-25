const addElementsById = (_api) => {
  return (
    objectId,
    systemReserved,
    formAction,
    modalName,
    newObjects = false
  ) => {
    var modal = _api.system.getModal(modalName);
    var object = document.getElementById(objectId),
      modalObjects = [],
      systemReserved;

    for (var i in modal.inputStore) {
      modalObjects[i] = [modal.inputStore[i], modal.inputDataStore[i]];
    }

    if (newObjects != false) {
      for (var i in newObjects) {
        modalObjects.push(newObjects[i]);
        modal.inputStoreSession.push(newObjects[i][0]);
        modal.inputDataStoreSession.push(newObjects[i][1]);
      }
    }

    modalObjects = new Map(modalObjects);
    _api.store.setInputItem(modalObjects);
    modalObjects = Object.fromEntries(modalObjects);

    Object.entries(modalObjects).forEach((entry) => {
      const [key, value] = entry;

      var label = document.createElement('label');

      label.setAttribute('id', key);

      label.setAttribute('hidden', '');

      label.innerHTML = value;

      object.appendChild(label);
    });
  };
};

const removeElementsById = (_api) => {
  return (objectId, systemReserved, formAction, modalName) => {
    var modal = _api.system.getModal(modalName);
    var object = document.getElementById(objectId);
    for (var i in modal.inputStore) {
      document.getElementById(modal.inputStore[i]).remove();
    }
    for (var i in modal.inputStoreSession) {
      document.getElementById(modal.inputStoreSession[i]).remove();
    }
    modal.inputStoreSession = [];
    modal.inputDataStoreSession = [];
  };
};

const modalSync = (_api) => {
  return (modalFunc, modalName) => {
    modal = _api.system.getModal(modalName);
    for (var j in modal.select) {
      var select = document.getElementById(modal.select[j]);
      var dataset = _api.user.getUserProfileData(modal.datasets[j]);
      for (var k in dataset) {
        var opt = dataset[k];
        var el = document.createElement('option');
        el.textContent = opt.content;
        el.value = opt.value;
        select.appendChild(el);
      }
    }
  };
};

const modalMiddleware = (_api) => {
  return {
    addElementsById: addElementsById(_api),
    removeElementsById: removeElementsById(_api),
    modalSync: modalSync(_api)
  };
};

export { modalMiddleware };
