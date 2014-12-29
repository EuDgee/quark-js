
describe('DOM: watch and change', function() {
  beforeEach(function() {
    this.node = document.createElement('div');
    test.appendToBody(this.node);

    this.timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
  });

  afterEach(function() {
    test.removeFromBody(this.node);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = this.timeout;
  });

  it('watch div with templates', function() {
    this.node.innerHTML =
        '<div id="special1" data-lt-template="test-template"></div>';
    spyOn(q.dom, 'watchAttribute');

    q.registerNode(this.node);

    expect(q.dom.watchAttribute).toHaveBeenCalledWith(
        document.getElementById('special1'), 'test-template');
    expect(q.dom.watchAttribute.calls.count()).toBe(1);
  });

  it('do not watch div w/o templates', function() {
    this.node.innerHTML = '<div></div>';
    spyOn(q.dom, 'watchAttribute');

    q.registerNode(this.node);

    expect(q.dom.watchAttribute).not.toHaveBeenCalled();
  });

  it('watch nested div', function() {
    this.node.innerHTML =
        '<div id = "watch1" data-lt-template = "watch-template-1">' +
        '  <div id = "do-not-watch1">' +
        '    <div id = "watch2" data-lt-template = "watch-template-2">' +
        '    </div>' +
        '  </div>' +
        '  <div id = "watch3" data-lt-template = "watch-template-3">' +
        '    <div id = "do-not-watch2"></div>' +
        '  </div>' +
        '</div>';
    spyOn(q.dom, 'watchAttribute');
    q.registerNode(this.node);

    expect(q.dom.watchAttribute.calls.count()).toBe(3);
    expect(q.dom.watchAttribute).toHaveBeenCalledWith(
        document.getElementById('watch1'), 'watch-template-1');
    expect(q.dom.watchAttribute).toHaveBeenCalledWith(
        document.getElementById('watch2'), 'watch-template-2');
    expect(q.dom.watchAttribute).toHaveBeenCalledWith(
        document.getElementById('watch3'), 'watch-template-3');
  });

  it('listen inputs with data-lt-value', function() {
    this.node.innerHTML =
        '<input id = "input1" data-lt-value = "template1" />' +
        '<input id = "other" data-other-value = "stuff" />';
    var input = document.getElementById('input1');
    spyOn(q.dom, 'listenChange');

    q.registerNode(this.node);

    expect(q.dom.listenChange.calls.count()).toBe(1);
    expect(q.dom.listenChange).toHaveBeenCalledWith(input, 'template1');
  });

  it('should change a model when textarea has been modified', function(done) {
    this.node.innerHTML =
        '<textarea id = "area" data-lt-value = "area-templ"></textarea>';
    var area = document.getElementById('area');

    q.registerNode(this.node);

    q.watch('area-templ', function(key, storage) {
      expect(storage.get('area-templ')).toBe('wizardy magic');
      done();
    });

    area.value = 'wizardy magic';
    test.dispatchEvent(area, q.dom._inputListenEvent);
  });

  it('should modify a textarea value on model change', function(done) {
    this.node.innerHTML =
        '<textarea id = "area51" data-lt-value = "t51"></textarea>';
    q.registerNode(this.node);
    var area = document.getElementById('area51');

    q.set('t51', 'do`h');

    setTimeout(function() {
      expect(area.value).toBe('do`h');
      done();
    }, 1);
  });

  it('should modify div coords and size', function(done) {
    this.node.innerHTML =
        '<div id = "move-me" data-lt-left = "left" data-lt-top = "top" ' +
        'data-lt-width = "width" data-lt-height = "height"></div>';
    q.registerNode(this.node);
    var div = document.getElementById('move-me');

    q.set('left', '10px');
    q.set('top', '11px');
    q.set('width', '100px');
    q.set('height', '200px');

    setTimeout(function() {
      expect(div.style.left).toBe('10px');
      expect(div.style.top).toBe('11px');
      expect(div.style.width).toBe('100px');
      expect(div.style.height).toBe('200px');
      done();
    }, 100);
  });
});
