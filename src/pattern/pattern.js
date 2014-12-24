

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
  var patterns = [];
  var pat = q.pat.__findPattern(text);
  while (pat['found'] !== '') {
    patterns.push(pat['found']);
    pat = q.pat.__findPattern(pat['left']);
  }

  return patterns;
};


/**
 * @param {string} text
 * @param {!Array.<string>} patterns
 * @param {!q.IStorage} storage
 * @return {string}
 */
q.pat.evalPattern = function(text, patterns, storage) {
  var result = text;
  for (var i = 0, l = patterns.length; i < l; i += 1) {
    result = result.replace(q.pat.OPEN + patterns[i] + q.pat.CLOSE,
        storage.get(patterns[i]) || '');
  }

  return result;
};


/**
 * @param {string} text
 * @return {!Object}
 */
q.pat.__findPattern = function(text) {
  var result = {
    'found': ''
  };
  var start = text.indexOf(q.pat.OPEN);
  if (start >= 0) {
    var textAfterStart = text.substr(start + q.pat.OPEN.length);
    var end = textAfterStart.indexOf(q.pat.CLOSE);
    result['found'] = textAfterStart.substr(0, end);
    result['left'] = textAfterStart.substr(end + q.pat.CLOSE.length);
  }

  return result;
};
