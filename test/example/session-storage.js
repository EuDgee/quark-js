


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
  if (value === '') {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, value);
  }
};
