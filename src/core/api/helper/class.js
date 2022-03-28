class System {
  constructor(data) {
    this.data = {
      processName: data.name,
      pluginIndex: 0
    };
    this.next = null;
  }

  getPluginIndex() {
    return this.data.pluginIndex;
  }

  updatePlugin() {
    this.data.pluginIndex++;
    return this.data;
  }

  setNextNode(node) {
    if (node instanceof System || node === null) {
      this.next = node;
    } else {
      throw new Error('Next node must be a member of the Node class.');
    }
  }

  getNextNode() {
    return this.next;
  }
}

export { System };
