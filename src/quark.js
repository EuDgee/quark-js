

/**
 * @typedef {string}
 */
q.Data;


/**
 * @param {!Node} node
 */
q.registerNode = function(node) {
  if (typeof node['nodeValue'] === 'string' &&
      node['innerText'] === node['innerHTML'] && node['nodeType'] === 3) {
    var value = node['nodeValue'];
    var patterns = q.pat.detectPattern(value);
    if (patterns.length > 0) {
      q.dom.addToWatch(node.parentNode, value, patterns);
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
  if (q.__watchers[key] !== undefined) {
    q.__watchers[key].map(function(callback) {
      setTimeout(function() {
        callback(q.__storage);
      }, 0);
    });
  }
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
 * @type {!q.IStorage}
 */
q.__storage = new q.Storage();


/**
 * @type {!Object}
 */
q.__watchers = {};
