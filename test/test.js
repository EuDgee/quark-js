

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
