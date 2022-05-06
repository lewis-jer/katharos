class Store {
  constructor(data) {
    this.data = {
      inputStore: {}
    };
    this.next = null;
  }

  setInputItem(data) {
    Object.assign(this.data.inputStore, { ...Object.fromEntries(data) });
  }

  getInputItem(key) {
    return this.data.inputStore[key];
  }

  setInputItem(key, value) {
    this.data.inputStore[key] = value;
  }

  getInputStore() {
    return this.data.inputStore;
  }

  clearInputStore() {
    this.data.inputStore = {};
  }
}

export { Store };
