

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
    var attributes = Object.keys(q.__DATA_ATTRIBUTES);
    attributes.map(getAttributeName).map(getAttribute).filter(filterEmpties).
        forEach(registerAttributeNode);

    var styleAttributes = Object.keys(q.__STYLE_ATTRIBUTES);
    styleAttributes.map(getStyle).filter(filterEmpties).
        forEach(registerStyleNode);
  }

  for (var j = 0, k = node.childNodes.length; j < k; j += 1) {
    q.registerNode(node.childNodes[j]);
  }

  /**
   * @param {string} attribute
   * @return {*}
   */
  function getAttribute(attribute) {
    return node['getAttribute'](attribute);
  }

  /**
   * @param {string} attribute
   * @return {string}
   */
  function getAttributeName(attribute) {
    return q.__DATA_PREFIX + attribute;
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  function filterEmpties(value) {
    return Boolean(value);
  }

  /**
   * @param {string} value
   */
  function registerAttributeNode(value) {
    q.__registerNode(node, value, q.dom.watchAttribute);
  }

  /**
   * @param {string} value
   */
  function registerStyleNode(value) {
    q.__registerNode(node, value, q.dom.watchStyle);
  }

  function getStyle(attribute) {
    return node['style'][attribute];
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
q.__DATA_PREFIX = 'data-lt-';


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
 * Capital letters only, like in tagName
 * @type {!Array.<string>}
 */
q.__TAGS_TO_LISTEN = [
  'INPUT',
  'TEXTAREA'
];


/**
 * @type {!Array.<string>}
 */
q.__TAGS_WITH_PATTERNS = [
  'DIV'
];


/**
 * @type {!q.IStorage}
 */
q.__storage = new q.Storage();


/**
 * @type {!Object}
 */
q.__watchers = {};


/**
 * @param {!Node} node
 * @param {string} value
 * @param {function(!Node, string, !Array.<string>)} watcher
 */
q.__registerNode = function(node, value, watcher) {
  var patterns = [value];
  if (q.util.indexOf(node.tagName, q.__TAGS_WITH_PATTERNS) >= 0) {
    patterns = q.pat.detectPattern(value);
  }

  if (patterns.length > 0) {
    watcher(node, value, patterns);
  }

  if (q.util.indexOf(node.tagName, q.__TAGS_TO_LISTEN) >= 0) {
    q.dom.listenChange(node, value);
  }
};
