class testUser {
  constructor() {
    this._array = [];
  }

  push(newValue) {
    this._array.push(newValue);
  }

  pop() {
    return this._array.pop();
  }
}

const user = new testUser();
user.push('toast');
user._array.unshift('value');

// Testing Classes //
// Node Modules //
class testNode1 {
  constructor(data) {
    this.data = data;
    this.next = null;
  }

  setNextNode(node) {
    if (node instanceof testNode1 || node === null) {
      this.next = node;
    } else {
      throw new Error('Next node must be a member of the Node class.');
    }
  }
}

const firstNode = new testNode1('I am an instance of a Node!');
const secondNode = new testNode1('I am the next Node!');
firstNode.setNextNode(secondNode);

// Testing Ice Creams //
class testNode2 {
  constructor(data) {
    this.data = data;
    this.next = null;
  }

  setNextNode(node) {
    if (node instanceof testNode2 || node === null) {
      this.next = node;
    } else {
      throw new Error('Next node must be a member of the Node class.');
    }
  }

  getNextNode() {
    return this.next;
  }
}

const vanillaNode = new testNode2('Vanilla');
const strawberryNode = new testNode2('Berry Tasty');
const coconutNode = new testNode2('Coconuts for Coconut');

vanillaNode.setNextNode(strawberryNode);
strawberryNode.setNextNode(coconutNode);

let currentNode = vanillaNode;
while (currentNode) {
  console.log(currentNode.data);
  currentNode = currentNode.getNextNode();
}

class System {
  constructor(data) {
    this.data = {
      processName: data.name
    };
    this.next = null;
  }

  updateNode() {}

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
