const addElementsById = (_api) => {
  return (
    objectId,
    systemReserved,
    formAction,
    modalName,
    newObjects = false
  ) => {
    var modalInfo = _api.arrayToObject(
      modals[modalName.replace(`${formAction}`, '')]
    )[modalName];
    var object = document.getElementById(objectId),
      modalObjects = [],
      systemReserved;
    for (var i in modalInfo.inputStore) {
      modalObjects[i] = [modalInfo.inputStore[i], modalInfo.inputDataStore[i]];
    }
    if (newObjects != false) {
      for (var i in newObjects) {
        modalObjects.push(newObjects[i]);
        modalInfo.inputStoreSession.push(newObjects[i][0]);
        modalInfo.inputDataStoreSession.push(newObjects[i][1]);
      }
    }
    modalObjects = new Map(modalObjects);
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
    var modalInfo = _api.arrayToObject(
      modals[modalName.replace(`${formAction}`, '')]
    )[modalName];
    var object = document.getElementById(objectId);
    for (var i in modalInfo.inputStore) {
      document.getElementById(modalInfo.inputStore[i]).remove();
    }
    for (var i in modalInfo.inputStoreSession) {
      document.getElementById(modalInfo.inputStoreSession[i]).remove();
    }
    modalInfo.inputStoreSession = [];
    modalInfo.inputDataStoreSession = [];
  };
};

const modalSync = (_api) => {
  return (modalFunc, modalName) => {
    console.log(_api.system.getModal(modalName));
    for (var i in modals[modalFunc]) {
      if (modals[modalFunc][i].modal == modalName) {
        for (var j in modals[modalFunc][i].select) {
          var select = document.getElementById(modals[modalFunc][i].select[j]);

          var dataset = _api.user.getUserProfileData(
            modals[modalFunc][i].datasets[j]
          );
          for (var k in dataset) {
            var opt = dataset[k];
            var el = document.createElement('option');
            el.textContent = opt.content;
            el.value = opt.value;
            select.appendChild(el);
          }
        }
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
