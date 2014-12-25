

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
