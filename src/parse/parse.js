

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
