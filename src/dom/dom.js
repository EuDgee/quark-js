

/**
 * @param {!Node} node
 * @param {string} origValue
 * @param {!Array.<string>} patterns
 */
q.dom.addToWatch = function(node, origValue, patterns) {
  for (var i = 0, l = patterns.length; i < l; i += 1) {
    q.watch(patterns[i], function() {
      node.innerHTML = q.pat.evalPattern(origValue, patterns, q.__storage);
    });
  }
};
