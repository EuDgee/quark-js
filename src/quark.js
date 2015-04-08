

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
  return String(q.__storage.get(key) || '');
};


/**
 * @param {string} key
 * @param {function(string, q.IStorage)} callback
 */
q.watch = function(key, callback) {
  if (q.__watchers[key] === undefined) {
    q.__watchers[key] = [];
  }

  q.__watchers[key].push(callback);
};


/**
 * @param {string} key
 * @param {function(string, q.IStorage)} callback
 */
q.unwatch = function(key, callback) {
  if (q.__watchers[key] !== undefined) {
    var index = q.__watchers[key].indexOf(callback);
    if (index >= 0) {
      q.__watchers[key].splice(index, 1);
    }
  }
};


/**
 * @param {function(string, !q.IStorage)} callback
 */
q.watchAll = function(callback) {
  q.__allWatchers.push(callback);
};


/**
 * @param {function(string, !q.IStorage)} callback
 */
q.unwatchAll = function(callback) {
  var index = q.__allWatchers.indexOf(callback);
  if (index >= 0) {
    q.__allWatchers.splice(index, 1);
  }
};


/**
 * @param {string} key
 * @param {boolean=} opt_triggerAllUpdate
 */
q.updateKey = function(key, opt_triggerAllUpdate) {
  function callWatcher(watcher) {
    return function() {
      watcher(key, q.__storage);
    }
  }

  if (q.__watchers[key] !== undefined) {
    for (var i = 0, l = q.__watchers[key].length; i < l; i += 1) {
      setTimeout(callWatcher(q.__watchers[key][i]), 0);
    }
  }

  if (opt_triggerAllUpdate !== false) {
    for (var j = 0, k = q.__allWatchers.length; j < k; j += 1) {
      setTimeout(callWatcher(q.__allWatchers[j]), 0);
    }
  }
};


/**
 * @type {!Object}
 */
q.__DATA_ATTRIBUTES = {
  'value': 'value',
  'template': 'innerHTML',
  'selector': 'selectedIndex'
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


/**
 * @type {!Array}
 */
q.__allWatchers = [];
