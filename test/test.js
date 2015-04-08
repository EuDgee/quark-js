

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
    if (element[eventName] !== undefined) {
      result = element.fireEvent(eventName, event);
    }
  } else {
    event = document.createEvent('UIEvents');
    event.initUIEvent(type, true, true, window, 1);

    result = !element.dispatchEvent(event);
  }

  return result;
};
