
describe('DOM: watch and change', function() {
  beforeEach(function() {
    this.node = document.createElement('div');
    test.appendToBody(this.node);
  });

  afterEach(function() {
    test.removeFromBody(this.node);
  });

  it('watch elements with templates', function() {
    this.node.innerHTML = '<div id="special1">{{test-template}}</div>';
    spyOn(q.dom, 'addToWatch');

    q.registerNode(this.node);

    expect(q.dom.addToWatch).toHaveBeenCalledWith(
        document.getElementById('special1'), '{{test-template}}',
        ['test-template']);
    expect(q.dom.addToWatch.calls.count()).toBe(1);
  });

  it('do not watch elements w/o templates', function() {
    this.node.innerHTML = '<div></div>';
    spyOn(q.dom, 'addToWatch');

    q.registerNode(this.node);

    expect(q.dom.addToWatch).not.toHaveBeenCalled();
  });

  it('watch nested nodes', function() {
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
});
