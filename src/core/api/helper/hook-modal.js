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

const smodalMiddleware = (_api) => {
  return {
    addElementsById: addElementsById(_api),
    removeElementsById: removeElementsById(_api)
  };
};

export { modalMiddleware };
