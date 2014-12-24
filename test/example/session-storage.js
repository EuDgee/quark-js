


/**
 * @constructor
 * @implements {q.IStorage}
 */
var Storage = function() {};


/**
 * @inheritDoc
 */
Storage.prototype.get = function(key) {
  return sessionStorage.getItem(key);
};


/**
 * @inheritDoc
 */
Storage.prototype.set = function(key, value) {
  sessionStorage.setItem(key, value);
};
