

/**
 * @type {string}
 */
q.pat.OPEN = '{{';


/**
 * @type {string}
 */
q.pat.CLOSE = '}}';


/**
 * @param {string} text
 * @return {!Array.<string>}
 */
q.pat.detectPattern = function(text) {
  return q.mustache.parse(text).reduce(function(accum, value) {
    if (value[0] !== 'text') {
      accum.push(value[1]);
    }
    return accum
  }, []);
};


/**
 * @param {string} text
 * @param {!Array.<string>} patterns
 * @param {!q.IStorage} storage
 * @return {string}
 */
q.pat.evalPattern = function(text, patterns, storage) {
  var payload = {};
  for (var i = 0, l = patterns.length; i < l; i += 1) {
    payload[patterns[i]] = storage.get(patterns[i]);
  }
  return q.mustache.render(text, payload)
};
