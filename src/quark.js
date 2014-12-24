

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
  if (typeof node['nodeValue'] === 'string' &&
      node['innerText'] === node['innerHTML'] && node['nodeType'] === 3) {
    var value = node['nodeValue'];
    var patterns = q.pat.detectPattern(value);
    if (patterns.length > 0) {
      var element = node.parentNode;
      if (element !== null) {
        q.dom.addToWatch(element, value, patterns);
      }
    }
  }

  if (node['getAttribute'] !== undefined) {
    var pattern = node.getAttribute(q.__DATA_ATTRIBUTE);
    if (typeof pattern === 'string') {
      q.dom.listenChange(node, pattern);
      q.dom.addToWatch(node, pattern, [pattern]);
    }
  }

  for (var i = 0, l = node.childNodes.length; i < l; i += 1) {
    q.registerNode(node.childNodes[i]);
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
 * @type {string}
 */
q.__DATA_ATTRIBUTE = 'data-lt-value';


/**
 * @type {!q.IStorage}
 */
q.__storage = new q.Storage();


/**
 * @type {!Object}
 */
q.__watchers = {};
