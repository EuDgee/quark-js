


/**
 * @constructor
 * @extends {q.parse.Parser}
 *
 * @param {!Node} node
 * @param {string} attribute
 */
q.parse.AttributeParser = function(node, attribute) {
  q.parse.Parser.call(this, node, attribute);
};

q.util.inherits(q.parse.AttributeParser, q.parse.Parser);


/**
 * @inheritDoc
 */
q.parse.AttributeParser.prototype.watch = function() {
  q.dom.watchAttribute(this._node, this._origValue);

  if (q.util.indexOf(this._node.tagName, q.parse.__TAGS_TO_LISTEN) >= 0) {
    q.dom.listenChange(this._node, this._origValue);
  }
};
