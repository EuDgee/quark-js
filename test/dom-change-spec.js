
describe('DOM: watch and change', function() {
  beforeEach(function() {
    this.node = document.createElement('div');
    test.appendToBody(this.node);
  });

  afterEach(function() {
    test.removeFromBody(this.node);
  });

  it('watch div with templates', function() {
    this.node.innerHTML = '<div id="special1">{{test-template}} {{test-template-2}}</div>';
    spyOn(q.dom, 'addToWatch');

    q.registerNode(this.node);

    expect(q.dom.addToWatch).toHaveBeenCalledWith(
        document.getElementById('special1'), '{{test-template}} {{test-template-2}}',
        ['test-template' ,'test-template-2']);
    expect(q.dom.addToWatch.calls.count()).toBe(1);
  });

  it('do not watch div w/o templates', function() {
    this.node.innerHTML = '<div></div>';
    spyOn(q.dom, 'addToWatch');

    q.registerNode(this.node);

    expect(q.dom.addToWatch).not.toHaveBeenCalled();
  });

  it('watch nested div', function() {
    this.node.innerHTML =
        '<div id = "watch1">{{watch-template-1}}' +
        '  <div id = "do-not-watch1">' +
        '    <div id = "watch2">{{watch-template-2}}</div>' +
        '  </div>' +
        '  <div id = "watch3">{{watch-template-3}} text {{more}}' +
        '    <div id = "do-not-watch2"></div>' +
        '  </div>' +
        '</div>';
    spyOn(q.dom, 'addToWatch');
    q.registerNode(this.node);

    expect(q.dom.addToWatch.calls.count()).toBe(3);
    expect(q.dom.addToWatch).toHaveBeenCalledWith(
        document.getElementById('watch1'), '{{watch-template-1}}  ',
        ['watch-template-1']);
    expect(q.dom.addToWatch).toHaveBeenCalledWith(
        document.getElementById('watch2'), '{{watch-template-2}}',
        ['watch-template-2']);
    expect(q.dom.addToWatch).toHaveBeenCalledWith(
        document.getElementById('watch3'),
        '{{watch-template-3}} text {{more}}    ', ['watch-template-3', 'more']);
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

    q.watch('area-templ', function(storage) {
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
});
