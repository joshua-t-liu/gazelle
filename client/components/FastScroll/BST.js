const BST = function(func) {
  this.root = Node.NIL;
  this.height = 0;
  this.size = 0;
  this.compareFunc = func || ((a, b) => a - b);
}

BST.prototype.isValid = function() {
  if (!this.root) return true;
  if (!this.root.isBlack) return 'root is red';

  let blackHeight;
  let error;

  function checkBlackHeight(node, numBlack = 0) {
    if (node === Node.NIL) {
      if (!blackHeight) blackHeight = numBlack;

      if (numBlack !== blackHeight) error = 'black height does not match.';

      return (error) ? false : true;
    }

    if (!checkBlackHeight(node.left, numBlack + node.isBlack)) return false;
    if (!checkBlackHeight(node.right, numBlack + node.isBlack)) return false;

    return true;
  }

  checkBlackHeight(this.root);

  if (error) console.log(error);

  return (error) ? false : true;
}

const Node = function(val = null, parent = Node.NIL, isBlack = true, left = Node.NIL, right = Node.NIL) {
  this.val = val;
  this.parent = parent;
  this.left = left;
  this.right = right;
  this.isBlack = isBlack;
}

const NIL = {};
Object.defineProperty(NIL, 'isBlack', { value: true });
Object.defineProperty(NIL, 'left', { value: null });
Object.defineProperty(NIL, 'right', { value: null });
Object.defineProperty(NIL, 'parent', { value: null });
Object.defineProperty(Node, 'NIL', { value: NIL });

BST.prototype.find = function(val) {
  let node = this.root;

  while(node !== Node.NIL) {
    if (this.compareFunc(node.val, val) === 0) return val;
    if (this.compareFunc(node.val, val) < 0) {
      node = node.right;
    } else {
      node = node.left;
    }
  }

  return null;
}

BST.prototype.insert = function(val) {
  let node = this.root;
  let prev;
  let level = 0;

  while (node !== Node.NIL) {
    prev = node;
    if (this.compareFunc(node.val, val) < 0) {
      node = node.right;
    } else {
      node = node.left;
    }
    level++;
  }

  if (!prev) {
    this.root = new Node(val);
    this.height = 1;
  } else if (this.compareFunc(prev.val, val) < 0) {
    prev.right = new Node(val, prev, false);
    this.fixInsertRB(prev.right);
  } else {
    prev.left = new Node(val, prev, false);
    this.fixInsertRB(prev.left);
  }

  this.height = Math.max(this.height, level);
  this.size++;
}

BST.prototype.fixInsertRB = function(node) {
  let child = node;
  let parent = node.parent;
  let grandparent = parent.parent;
  while (!child.isBlack && !parent.isBlack) {

    if (!grandparent.left.isBlack && !grandparent.right.isBlack) {
      grandparent.isBlack = false;
      grandparent.left.isBlack = true;
      grandparent.right.isBlack = true;
      child = grandparent;
    } else if (parent.left === child && grandparent.left === parent) {
      this.rightRotate(grandparent);
      grandparent.isBlack = false;
      parent.isBlack = true;
      child.isBlack = false;
    } else if (parent.right === child && grandparent.right === parent) {
      this.leftRotate(grandparent);
      grandparent.isBlack = false;
      parent.isBlack = true;
      child.isBlack = false;
    } else if (grandparent.right === parent)  {
      this.rightRotate(parent);
      child = parent;
    } else {
      this.leftRotate(parent);
      child = parent;
    }

    parent = child.parent;
    grandparent = parent.parent;
  }

  this.root.isBlack = true;

  return null;
}

// left rotation
BST.prototype.leftRotate = function(node) {
  if (!node.right) return;
  const right = node.right;
  const temp = right.left;
  right.left = node;
  if (node.parent !== Node.NIL) {
    if (node.parent.left === node) {
      node.parent.left = right;
    } else {
      node.parent.right = right;
    }
  }
  right.parent = node.parent;
  node.parent = right;
  node.right = temp;
  if (temp) temp.parent = node;
  if (node === this.root) this.root = right;
}

// right rotation
BST.prototype.rightRotate = function(node) {
  if (!node.left) return;
  const left = node.left;
  const temp = left.right;
  left.right = node;
  if (node.parent !== Node.NIL) {
    if (node.parent.left === node) {
      node.parent.left = left;
    } else {
      node.parent.right = left;
    }
  }
  left.parent = node.parent;
  node.parent = left;
  node.left = temp;
  if (temp) temp.parent = node;
  if (node === this.root) this.root = left;
}

export default BST;

// const rangeCompare = ([a1, b1], [a2, b2]) => {
//   if ((a1 <= a2 && b2 <= b1) || (a2 <= a1 && b1 <= b2)) return 0;
//   return b1 - a2;
// }

// tree = new BST(rangeCompare);
// Array(100000).fill().forEach((_, idx) => tree.insert([idx * 100, (idx * 100) + 100]));