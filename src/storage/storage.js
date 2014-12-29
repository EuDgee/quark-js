


/**
 * @constructor
 * @implements {q.IStorage}
 */
q.Storage = function() {

  /**
   * @type {!Object}
   */
  this.__storage = {};
};


/**
 * @param {string} key
 * @return {q.Data}
 */
q.Storage.prototype.get = function(key) {
  return String(this.__storage[key] || '');
};


/**
 * @param {string} key
 * @param {q.Data} value
 */
q.Storage.prototype.set = function(key, value) {
  this.__storage[key] = value;
};
