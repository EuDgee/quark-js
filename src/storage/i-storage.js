


/**
 * @interface
 */
q.IStorage = function() {};


/**
 * @param {string} key
 * @return {q.Data}
 */
q.IStorage.prototype.get = function(key) {};


/**
 * @param {string} key
 * @param {q.Data} value
 */
q.IStorage.prototype.set = function(key, value) {};
