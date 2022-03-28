class user {
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

const user = new user();
user.push('toast');
user._array.unshift('value');
console.log(stack);

// Testing Classes //
// Node Modules //
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }

  setNextNode(node) {
    if (node instanceof Node || node === null) {
      this.next = node;
    } else {
      throw new Error('Next node must be a member of the Node class.');
    }
  }
}

const firstNode = new Node('I am an instance of a Node!');
const secondNode = new Node('I am the next Node!');
firstNode.setNextNode(secondNode);

// Testing Ice Creams //
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }

  setNextNode(node) {
    if (node instanceof Node || node === null) {
      this.next = node;
    } else {
      throw new Error('Next node must be a member of the Node class.');
    }
  }

  getNextNode() {
    return this.next;
  }
}

const vanillaNode = new Node('Vanilla');
const strawberryNode = new Node('Berry Tasty');
const coconutNode = new Node('Coconuts for Coconut');

vanillaNode.setNextNode(strawberryNode);
strawberryNode.setNextNode(coconutNode);

let currentNode = vanillaNode;
while (currentNode) {
  console.log(currentNode.data);
  currentNode = currentNode.getNextNode();
}

class System {
  constructor(data) {
    this.data = data;
    this.next = null;
  }

  setNextNode(node) {
    if (node instanceof Node || node === null) {
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
