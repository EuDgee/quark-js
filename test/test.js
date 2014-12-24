

/**
 * @namespace
 */
var test = {};


/**
 * @param {!Node} node
 */
test.appendToBody = function(node) {
  var body = document.getElementsByTagName('body');
  if (body.length > 0) {
    body[0].appendChild(node);
  }
};


/**
 * @param {!Node} node
 */
test.removeFromBody = function(node) {
  var body = document.getElementsByTagName('body');
  if (body.length > 0) {
    body[0].removeChild(node);
  }
};


/**
 * @param {!Node|!Window} element
 * @param {string} type
 * @return {boolean}
 */
test.dispatchEvent = function(element, type) {
  var result = false;

  var event = null;
  if (document.createEventObject !== undefined) {
    event = document.createEventObject();

    var eventName = 'on' + type;
    if (element[eventName] === undefined) {
      util.dom.__dispatchCustomIEEvent(element, event, type);
    } else {
      result = element.fireEvent(eventName, event);
    }
  } else {
    event = document.createEvent('UIEvents');
    event.initUIEvent(type, true, true, window, 1);

    result = !element.dispatchEvent(event);
  }

  return result;
};


/**
 * @param {!Node|!Window} element
 * @param {string} type
 * @param {!function(Event)} handler
 */
test.__addCustomIEListener = function(element, type, handler) {
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
