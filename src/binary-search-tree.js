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

    removeNode.call(this, nodeToRemove)
    function removeNode(nodeToRemove) {

      // if there is NO CHILDREN
      if (!nodeToRemove.left && !nodeToRemove.right) {
        if (nodeToRemove === this._rootNode) {
          this._rootNode = null
          return
        }
        nodeToRemove.parent.node[nodeToRemove.parent.branch] = null
        return
      }

      // if there is ONE CHILD
      if (!nodeToRemove.right || !nodeToRemove.left) {
        const direction = nodeToRemove.right ? 'right' : 'left'
        nodeToRemove[direction].parent = nodeToRemove.parent
        if (nodeToRemove === this._rootNode) {
          this._rootNode = nodeToRemove[direction]
        } else {
          nodeToRemove.parent.node[nodeToRemove.parent.branch] = nodeToRemove[direction]
        }
        return
      }
      
      // if THERE ARE CHILDREN
      let randomDirection = Math.random() < 0.5 ? 'left' : 'right'
  
      const newNode = this._searchInSubtree(
        randomDirection === 'left' ? 'max' : 'min', 
        nodeToRemove[randomDirection]
      )

      nodeToRemove.data = newNode.data
      removeNode.call(this, newNode)
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

module.exports = {
  BinarySearchTree
};