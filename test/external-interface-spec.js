
describe('External interface', function() {
  beforeEach(function() {
    this.timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = this.timeout;
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
    var node = document.createElement('div');
    node.innerHTML = 'text and a little {{template}}';
    test.appendToBody(node);

    q.registerNode(node);
    q.set('template', 'bit of magic');

    setTimeout(function() {
      expect(node.innerText).toBe('text and a little bit of magic');
      done();
    }, 1);
  });

  it('Updating a DOM element should change values in a model', function(done) {
    var node = document.createElement('div');
    node.innerHTML = '<input id = "test-input" data-lt-value = "template"/>';
    test.appendToBody(node);
    var input = document.getElementById('test-input');
    q.registerNode(node);

    q.watch('template', function(storage) {
      expect(storage.get('template')).toBe('magic');
      done();
    });

    input.value = 'magic';
    test.dispatchEvent(input, 'change');
  });
});
