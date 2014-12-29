


/**
 * @constructor
 * @extends {q.parse.Parser}
 *
 * @param {!Node} node
 * @param {string} attribute
 */
q.parse.StyleParser = function(node, attribute) {
  q.parse.Parser.call(this, node, attribute);
};

q.util.inherits(q.parse.StyleParser, q.parse.Parser);


/**
 * @inheritDoc
 */
q.parse.StyleParser.prototype.watch = function() {
  q.dom.watchStyle(this._node, this._origValue);
};
