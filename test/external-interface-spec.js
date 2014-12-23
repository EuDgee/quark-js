
describe('External interface', function() {
  beforeEach(function() {
    this.timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
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

  xit('Set will update a DOM element', function() {
    var node = document.createElement('div');
    node.innerHTML = 'text and a little {{template}}';
    test.appendToBody(node);

    q.registerNode(node);
    q.set('template', 'bit of magic');

    expect(node.innerText).toBe('text and a little bit of magic');
  });
});
