


/**
 * @constructor
 * @param {!Node} node
 * @param {string} attribute
 */
q.parse.Parser = function(node, attribute) {
  /**
   * @type {!Node}
   */
  this._node = node;

  /**
   * @type {string}
   */
  this._origValue = node['getAttribute'](q.parse.__DATA_PREFIX + attribute) ||
      '';
};


/**
 * @return {boolean}
 */
q.parse.Parser.prototype.isValid = function() {
  return Boolean(this._origValue);
};


/**
 *
 */
q.parse.Parser.prototype.watch = function() {};
