

/**
 * @param {!Node} node
 * @param {string} origValue
 * @param {!Array.<string>} patterns
 */
q.dom.addToWatch = function(node, origValue, patterns) {
  for (var i = 0, l = patterns.length; i < l; i += 1) {
    q.watch(patterns[i], function() {
      if (node.tagName === 'DIV') {
        node.innerHTML = q.pat.evalPattern(origValue, patterns, q.__storage);
      } else if (node.tagName === 'INPUT') {
        node.value = q.__storage.get(origValue);
      }
    });

    q.updateKey(patterns[i]);
  }
};


/**
 * @param {!Node} node
 * @param {string} pattern
 */
q.dom.listenChange = function(node, pattern) {
  q.dom.__addEventListener(node, q.dom._inputListenEvent, function() {
    q.set(pattern, node['value']);
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
  'select': 'input',
  'change': 'input',
  'input': 'input'
};


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
