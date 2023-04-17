const { NotImplementedError } = require('../extensions/index.js');

// const { Node } = require('../extensions/list-tree.js');

/**
* Implement simple binary search tree according to task description
* using Node from extensions
*/

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.parent = null
  }

  attachNode(node) {
    const branch = this._compare(node.data)
    if (this[branch]) return false

    node.parent = {
      node: this,
      branch
    }
    this[branch] = node
    return true
  }

  getNext(data) {
    return this[this._compare(data)] || false
  }

  _compare(data) {
    if (data > this.data) {
      return 'right'
    }
    if (data < this.data) {
      return 'left'
    }
    return false
  }
}


class BinarySearchTree {
  constructor() {
    this._rootNode = null
  }

  root() {
    return this._rootNode
  }

  add(data) {
    const nodeToAdd = new Node(data)

    if (!this._rootNode) {
      this._rootNode = nodeToAdd
      return
    }

    let currentNode = this._rootNode
    while (currentNode) {
      if (currentNode.data === data) return

      if (currentNode.attachNode(nodeToAdd)) return

      currentNode = currentNode.getNext(data)
    }
  }

  has(data) {
    return !!this._searchNode(data)
  }

  find(data) {
    return this._searchNode(data) || null
  }

  remove(data) {
    // throw new NotImplementedError('Not implemented');
    const nodeToRemove = this._searchNode(data)
    if (!nodeToRemove) return

    // if there is NO CHILDREN
    if (!nodeToRemove.left && !nodeToRemove.right) {
      if (nodeToRemove === this._rootNode) {
        this._rootNode = null
        return
      }
      nodeToRemove.parent.node[nodeToRemove.parent.branch] = null
    }
    
    // if THERE ARE CHILDREN
    let randomDirection = (() => {
      if (nodeToRemove.right && nodeToRemove.left) {
        return 'left'
        return Math.random() < 0.5 ? 'left' : 'right'
      }
      if (!nodeToRemove.left) return 'right'
      return 'left'
    })()

    const newNode = this._searchInSubtree(
      randomDirection === 'left' ? 'max' : 'min', 
      nodeToRemove[randomDirection]
    )

    newNode.parent.node[newNode.parent.branch] = null

    // const oppositeDirection = randomDirection === 'left' ? 'right' : 'left'
    const orphan = newNode[randomDirection]
    if (orphan) {
      newNode.parent.node.attachNode(orphan)
    }

    newNode.left = newNode.right = null
    for (const childNode of [nodeToRemove.left, nodeToRemove.right]) {
      if (!childNode) continue
      newNode.attachNode(childNode)
    }

    const parent = nodeToRemove.parent?.node
    if (parent) {
      parent[nodeToRemove.parent.branch] = null
      parent.attachNode(newNode)
    } else {
      this._rootNode = newNode
    }
  }
  
  min() {
    return this._searchInSubtree('min')?.data
  }

  max() {
    return this._searchInSubtree('max')?.data
  }

  _searchNode(data) {
    let currentNode = this._rootNode

    while (currentNode) {
      if (currentNode.data === data) {
        return currentNode
      }
      currentNode = currentNode.getNext(data)
    }

    return null
  }

  _searchInSubtree(mode, node) {
    if (!['min', 'max'].includes(mode)) return false
    const direction = mode === 'min' 
      ? 'left' 
      : 'right'
    
    let currNode = node || this._rootNode
    while (currNode[direction]) {
      currNode = currNode[direction]
    }
    return currNode
  }
}

// const tree = new BinarySearchTree()
// tree.add(9);
// tree.add(14);
// tree.add(2);
// tree.add(6);
// tree.add(128);
// tree.add(8);
// tree.add(31);
// tree.add(54);
// tree.add(1);
// debugger
// tree.remove(14);
// tree.remove(8);
// tree.remove(9);

// console.log(tree.has(14),
// tree.has(8), 
// tree.has(9), 
// tree.has(2), 
// tree.has(6), 
// tree.has(128),
// tree.has(31),
// tree.has(54),
// tree.has(1), )

module.exports = {
  BinarySearchTree
};