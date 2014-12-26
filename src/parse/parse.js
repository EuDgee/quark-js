

/**
 * @type {string}
 */
q.parse.IGNORED_PATTERN = 'text';


/**
 * @param {string} text
 * @return {!Array.<string>}
 */
q.parse.detectPattern = function(text) {
  return q.mustache.parse(text).reduce(function(accum, value) {
    if (value[0] !== q.parse.IGNORED_PATTERN) {
      accum.push(value[1]);
    }
    return accum;
  }, []);
};


/**
 * @param {string} text
 * @param {!Array.<string>} patterns
 * @param {!q.IStorage} storage
 * @return {string}
 */
q.parse.evalPattern = function(text, patterns, storage) {
  var payload = {};
  for (var i = 0, l = patterns.length; i < l; i += 1) {
    payload[patterns[i]] = storage.get(patterns[i]);
  }
  return q.mustache.render(text, payload);
};


/**
 * @param {!Node} node
 * @param {!q.parse.TYPES} type
 * @return {function(string): q.parse.AttributeParser}
 */
q.parse.createParser = function(node, type) {
  return function(attribute) {
    if (type === q.parse.TYPES.ATTRIBUTE) {
      return new q.parse.AttributeParser(node, attribute);
    } else if (type === q.parse.TYPES.STYLE) {
      return new q.parse.StyleParser(node, attribute);
    }

    return null;
  }
};


/**
 * @param {q.parse.Parser} parser
 * @return {boolean}
 */
q.parse.isParserValid = function(parser) {
  return parser.isValid();
};


/**
 * @param {q.parse.Parser} parser
 * @return {q.parse.Parser}
 */
q.parse.watch = function(parser) {
  return parser.watch();
};


/**
 * @type {string}
 */
q.parse.__DATA_PREFIX = 'data-lt-';


/**
 * Capital letters only, like in tagName
 * @type {!Array.<string>}
 */
q.parse.__TAGS_TO_LISTEN = [
  'INPUT',
  'TEXTAREA'
];


/**
 * @type {!Array.<string>}
 */
q.parse.__TAGS_WITH_PATTERNS = [
  'DIV'
];
