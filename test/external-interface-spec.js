
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

  it('Watch for a key change', function(done) {
    q.watch('key', function(storage) {
      expect(storage.get('key')).toBe('value');
      done();
    });

    q.set('key', 'value');
  });

  it('Set should update a DOM element', function(done) {
    var self = this;
    this.node.innerHTML = 'text and a little {{template}}';

    q.registerNode(this.node);
    q.set('template', 'bit of magic');

    setTimeout(function() {
      expect(self.node.innerText).toBe('text and a little bit of magic');
      done();
    }, 1);
  });

  it('Updating a DOM element should change values in a model', function(done) {
    this.node.innerHTML =
        '<input id = "test-input" data-lt-value = "template"/>';
    var input = document.getElementById('test-input');
    q.registerNode(this.node);

    q.watch('template', function(storage) {
      expect(storage.get('template')).toBe('magic');
      done();
    });

    input.value = 'magic';
    test.dispatchEvent(input, 'input');
  });

  it('change input value after model modification', function(done) {
    this.node.innerHTML =
        '<input id = "inputt" data-lt-value = "templ-change" />' +
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
        '<input id = "input-in" data-lt-value = "templ-change" />' +
        '<div id = "div-out">{{templ-change}} works!</div>';
    var input = document.getElementById('input-in');
    var div = document.getElementById('div-out');
    q.registerNode(this.node);

    input.value = 'two-way';
    test.dispatchEvent(input, 'input');

    setTimeout(function() {
      expect(div.innerText).toBe('two-way works!');
      done();
    }, 1);
  });

  it('should replace patterns with empty values at start', function(done) {
    this.node.innerHTML = '<div id = "div-start">{{start-value}}</div>';

    q.registerNode(this.node);

    setTimeout(function() {
      expect(document.getElementById('div-start').innerText).toBe('');
      done();
    }, 1);
  });

  it('could set a custom and/filled storage', function() {
    this.node.innerHTML = '<div id = "set-div">{{set-store}}</div>';
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
    }, 10);
  });
});
