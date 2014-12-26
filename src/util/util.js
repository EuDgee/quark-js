

/**
 * @param {*} element
 * @param {!Array} array
 * @return {number}
 */
q.util.indexOf = function(element, array) {
  if (array.indexOf !== undefined) {
    return array.indexOf(element);
  } else {
    var i = 0,
        l = array.length;

    while (i < l) {
      if (array[i] === element) {
        return i;
      }

      i++;
    }
  }

  return -1;
};


/**
 * @param {*} value
 * @return {boolean}
 */
q.util.filterNull = function(value) {
  return value !== null;
};



/**
 * @constructor
 */
q.util.__ExtendLink = function() {};


/**
 * @param {!Object} Class
 * @param {!Object} Parent
 */
q.util.inherits = function(Class, Parent) {
  q.util.__ExtendLink.prototype = Parent.prototype;

  Class.prototype = new q.util.__ExtendLink();
  Class.prototype.constructor = Class;
};
