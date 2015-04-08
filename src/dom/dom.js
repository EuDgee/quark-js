

/**
 * @param {!Node} node
 * @param {string} origValue
 */
q.dom.watchAttribute = function(node, origValue) {
  function attributeWatch() {
    var attribute =
        q.dom.__VALUE_TO_WRITE[node.tagName] || q.dom.__DEFAULT_VALUE;
    var value = q.__storage.get(origValue) || '';
    if (node[attribute] !== value) {
      node[attribute] = value;
    }
  }

  q.watch(origValue, attributeWatch);
  q.updateKey(origValue);
};


/**
 * @param {!Node} node
 * @param {string} origValue
 */
q.dom.watchStyle = function(node, origValue) {
  function styleWatch(styleName) {
    return function() {
      var value = q.__storage.get(origValue);
      if (node['style'][styleName] !== value) {
        node['style'][styleName] = value;
      }
    }
  }

  q.watch(origValue, styleWatch(origValue));
  q.updateKey(origValue);
};


/**
 * @param {!Node} node
 * @param {string} pattern
 */
q.dom.listenChange = function(node, pattern) {
  q.dom.__addEventListener(node, q.dom._inputListenEvent, function() {
    var attribute =
        q.dom.__VALUE_TO_READ[node.tagName] || q.dom.__DEFAULT_VALUE;
    var value = node[attribute];
    if (q.get(pattern) !== value) {
      q.set(pattern, value);
    }
  });
};


/**
 * @type {number}
 */
q.dom.__lastElementId = 0;


/**
 * @param {!Node|!Window} element
 * @param {string} type
 * @param {!function(Event)} handler
 */
q.dom.__addEventListener = function(element, type, handler) {
  if (element.addEventListener !== undefined) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent !== undefined) {
    var eventName = 'on' + type;
    if (element[eventName] !== undefined) {
      if (element['__ieTargetId'] === undefined) {
        element['__ieTargetId'] = 'element_' + q.dom.__lastElementId++;
      }

      var listenerId = element['__ieTargetId'] + '_' + type;
      handler[listenerId] = function(event) {
        handler.call(element, event);
      };

      element.attachEvent(eventName, handler[listenerId]);
    }
  }
};


/**
 * @type {!Object}
 */
q.dom.__EVENT_TAGNAMES = {
  'select': 'change',
  'change': 'input',
  'input': 'input'
};


/**
 * default - value
 * @type {!Object.<string, string>}
 */
q.dom.__VALUE_TO_WRITE = {
  'DIV': 'innerHTML',
  'SELECT': 'selectedIndex'
};


/**
 * default - value
 * @type {!Object.<string, string>}
 */
q.dom.__VALUE_TO_READ = {
  'DIV': 'innerHTML',
  'SELECT': 'selectedIndex'
};


/**
 * @type {string}
 */
q.dom.__DEFAULT_VALUE = 'value';


/**
 * @param {string} eventName
 * @return {boolean}
 */
q.dom.__isEventSupported = function(eventName) {
  var el = document.createElement(q.dom.__EVENT_TAGNAMES[eventName] || 'div');
  eventName = 'on' + eventName;
  var isSupported = (eventName in el);
  if (!isSupported) {
    el.setAttribute(eventName, 'return;');
    isSupported = typeof el[eventName] === 'function';
  }
  el = null;
  return isSupported;
};


/**
 * @type {string}
 */
q.dom._inputListenEvent = q.dom.__isEventSupported('input') ?
    'input' : 'keyup';
