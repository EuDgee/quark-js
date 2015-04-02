

/**
 * @param {!Node} node
 * @param {string} origValue
 */
q.dom.watchAttribute = function(node, origValue) {
  q.watch(origValue, attributeWatch);
  q.updateKey(origValue);

  function attributeWatch() {
    var attribute =
        q.dom.__VALUE_TO_WRITE[node.tagName] || q.dom.__DEFAULT_VALUE;
    var value = q.__storage.get(origValue) || '';
    if (node[attribute] !== value) {
      node[attribute] = value;
    }
  }
};


/**
 * @param {!Node} node
 * @param {string} origValue
 */
q.dom.watchStyle = function(node, origValue) {
  q.watch(origValue, styleWatch(origValue));
  q.updateKey(origValue);

  function styleWatch(styleName) {
    return function() {
      var value = q.__storage.get(origValue);
      if (node['style'][styleName] !== value) {
        node['style'][styleName] = value;
      }
    }
  }
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
    if (element[eventName] === undefined) {
      q.dom.__addCustomIEListener(element, type, handler);
    } else {
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
 * @param {!Node|!Window} element
 * @param {string} type
 * @param {!function(Event)} handler
 */
q.dom.__addCustomIEListener = function(element, type, handler) {
  if (element['__customListener'] === undefined) {
    element['__customListener'] = function(event) {
      if (event['__type'] !== undefined) {
        var type = event['__type'];
        delete event['__type'];

        var handlers = element['__' + type];
        for (var i in handlers) {
          handlers[i].call(element, event);
        }
      }
    };

    element.attachEvent('onhelp', element['__customListener']);
  }

  if (element['__' + type] === undefined) {
    element['__' + type] = [];
  }

  element['__' + type].push(handler);
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
    isSupported = typeof el[eventName] == 'function';
  }
  el = null;
  return isSupported;
};


/**
 * @type {string}
 */
q.dom._inputListenEvent = q.dom.__isEventSupported('input') ?
    'input' : 'keyup';
