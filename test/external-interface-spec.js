
describe('External interface', function() {
  beforeEach(function() {
    this.timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

    this.node = document.createElement('div');
    test.appendToBody(this.node);
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = this.timeout;

    test.removeFromBody(this.node);
  });

  it('Set and get', function() {
    q.set('key', 'value');
    expect(q.get('key')).toBe('value');

    q.set('key', 'another-value');
    expect(q.get('key')).toBe('another-value');

    q.set('another-key', 'yo');
    expect(q.get('another-key')).toBe('yo');
  });

  it('Watch for a key change and unwatch', function(done) {
    var called = 0;
    q.watch('key', function watcher(key, storage) {
      called += 1;
      expect(storage.get('key')).toBe('value');
      q.unwatch('key', watcher);
      setTimeout(check, 100);
    });

    function check() {
      expect(called).toBe(1);
      done();
    }

    q.set('key', 'value');
  });

  it('Set should update a DOM element', function(done) {
    this.node.innerHTML =
        '<div id = "test-div" data-q-template = "template"></div>';

    q.registerNode(this.node);
    q.set('template', 'bit of magic');

    setTimeout(function() {
      expect(document.getElementById('test-div').innerHTML).
          toBe('bit of magic');
      done();
    }, 1);
  });

  it('Updating a DOM element should change values in a model', function(done) {
    this.node.innerHTML =
        '<input id = "test-input" data-q-value = "template"/>';
    var input = document.getElementById('test-input');
    q.registerNode(this.node);

    q.watch('template', function(key, storage) {
      expect(storage.get('template')).toBe('magic');
      done();
    });

    input.value = 'magic';
    test.dispatchEvent(input, q.dom._inputListenEvent);
  });

  it('change input value after model modification', function(done) {
    this.node.innerHTML =
        '<input id = "inputt" data-q-value = "templ-change" />' +
        '<input id = "other" data-other-value = "stuff" />';
    var input = document.getElementById('inputt');
    q.registerNode(this.node);

    q.set('templ-change', 'meh');

    setTimeout(function() {
      expect(input.value).toBe('meh');
      done();
    }, 1);
  });

  it('should change div when correspondent input change value', function(done) {
    this.node.innerHTML =
        '<input id = "input-in" data-q-value = "templ-change" />' +
        '<div id = "div-out" data-q-template = "templ-change">' +
        '</div>';
    var input = document.getElementById('input-in');
    var div = document.getElementById('div-out');
    q.registerNode(this.node);

    input.value = 'two-way';
    test.dispatchEvent(input, q.dom._inputListenEvent);

    setTimeout(function() {
      expect(div.innerText).toBe('two-way');
      done();
    }, 1);
  });

  it('should replace patterns with empty values at start', function(done) {
    this.node.innerHTML =
        '<div id = "div-start" data-q-template = "start-value"></div>';

    q.registerNode(this.node);

    setTimeout(function() {
      expect(document.getElementById('div-start').innerText).toBe('');
      done();
    }, 1);
  });

  it('could set a custom and/filled storage', function() {
    this.node.innerHTML = '<div id = "set-div">set-store</div>';
    var storage = new q.Storage();
    storage.set('set-store', 'custom storage');

    q.setStorage(function() {
      return storage;
    });
    q.registerNode(this.node);

    setTimeout(function() {
      expect(document.getElementById('set-div').innerText).
          toBe('custom storage');
      done();
    }, 3000);
  });

  it('watchAll should watch all key changes and unwatchAll', function(done) {
    var spy = jasmine.createSpy('watch-all-spy');
    q.watchAll(spy);

    q.set('key1', 'value1');
    q.set('key2', 'value2');
    q.unwatchAll(spy);
    q.set('key1', 'value3');

    setTimeout(function() {
      expect(spy.calls.count()).toBe(2);
      expect(spy).toHaveBeenCalledWith('key1', q.__storage);
      expect(spy).toHaveBeenCalledWith('key2', q.__storage);
      done();
    }, 1);
  });

  it('watchAll could be used with updateKey', function(done) {
    var times = 0;
    q.watchAll(function(key, storage) {
      times += 1;
      q.updateKey(key, false);
    });

    q.set('key-u', 'value');

    setTimeout(function() {
      expect(times).toBe(1);
      done();
    }, 100);
  });
});
