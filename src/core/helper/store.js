class Store {
  constructor(data) {
    this.data = {
      inputStore: {},
      domStore: {}
    };
    this.next = null;
  }

  getInputStore() {
    return this.data.inputStore;
  }

  getInputItem(key) {
    return this.data.inputStore[key];
  }

  setInputItem(data) {
    Promise.resolve(Object.assign(this.data.inputStore, { ...Object.fromEntries(data) }));
  }

  setInputStoreItem(key, value) {
    this.data.inputStore[key] = value;
  }

  getDomStore() {
    return this.data.domStore;
  }

  getDomItem(key) {
    return this.data.domStore[key];
  }

  setDomItem(data) {
    Object.assign(this.data.domStore, { ...Object.fromEntries(data) });
  }

  setDomStoreItem(key, value) {
    this.data.domStore[key] = value;
  }

  clearInputStore() {
    this.data.inputStore = {};
    this.data.domStore = {};
  }

  addElementsById(newObjects = false) {
    var modalObjects = [];

    function asyncOperation(item) {
      return new Promise((resolve) => {
        modalObjects.push(item);
        resolve(item);
      });
    }

    if (newObjects != false) {
      const promises = [];

      for (let index = 0; index < newObjects.length; index++) {
        const item = newObjects[index];
        promises.push(asyncOperation(item));
      }

      Promise.all(promises);
    }

    modalObjects = new Map(modalObjects);
    Promise.resolve(this.setInputItem(modalObjects));
  }
}

export { Store };
