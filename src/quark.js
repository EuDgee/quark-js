

/**
 * @typedef {string}
 */
q.Data;


/**
 * @param {function(): !q.IStorage} storageCreator
 */
q.setStorage = function(storageCreator) {
  q.__storage = storageCreator();
};


/**
 * @param {!Node} node
 */
q.registerNode = function(node) {
  if (node['getAttribute'] !== undefined) {
    Object.keys(q.__DATA_ATTRIBUTES).
        map(q.parse.createParser(node, q.parse.TYPES.ATTRIBUTE)).
        filter(q.parse.isParserValid).map(q.parse.watch);

    Object.keys(q.__STYLE_ATTRIBUTES).
        map(q.parse.createParser(node, q.parse.TYPES.STYLE)).
        filter(q.parse.isParserValid).map(q.parse.watch);
  }

  for (var j = 0, k = node.childNodes.length; j < k; j += 1) {
    q.registerNode(node.childNodes[j]);
  }
};


/**
 * @param {string} key
 * @param {q.Data} value
 */
q.set = function(key, value) {
  q.__storage.set(key, value);
  q.updateKey(key);
};


/**
 * @param {string} key
 * @return {q.Data}
 */
q.get = function(key) {
  return q.__storage.get(key);
};


/**
 * @param {string} key
 * @param {function(q.IStorage)} callback
 */
q.watch = function(key, callback) {
  if (q.__watchers[key] === undefined) {
    q.__watchers[key] = [];
  }

  q.__watchers[key].push(callback);
};


/**
 * @param {string} key
 */
q.updateKey = function(key) {
  if (q.__watchers[key] !== undefined) {
    for (var i = 0, l = q.__watchers[key].length; i < l; i += 1) {
      setTimeout(callWatcher(i), 0);
    }
  }

  function callWatcher(index) {
    return function() {
      q.__watchers[key][index](q.__storage);
    }
  }
};


/**
 * @type {!Object}
 */
q.__DATA_ATTRIBUTES = {
  'value': 'value',
  'template': 'innerHTML'
};


/**
 * @type {!Object}
 */
q.__STYLE_ATTRIBUTES = {
  'left': 'left',
  'top': 'top',
  'width': 'width',
  'height': 'height'
};


/**
 * @type {!q.IStorage}
 */
q.__storage = new q.Storage();


/**
 * @type {!Object}
 */
q.__watchers = {};
