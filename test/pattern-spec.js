
describe('Template patterns', function() {
  it('Detect template pattern', function() {
    var text = '{{simple}}';
    expect(q.parse.detectPattern(text)).toEqual(['simple']);

    text = 'no patterns at all';
    expect(q.parse.detectPattern(text)).toEqual([]);

    text = 'broken {{template';
    expect(q.parse.detectPattern(text)).toEqual([]);

    text = 'text and then {{template1}} little bit of a text and {{another}} s';
    expect(q.parse.detectPattern(text)).toEqual(['template1', 'another']);

    text = 'broken }} and {{normal}} and {{broken';
    expect(q.parse.detectPattern(text)).toEqual(['normal']);
  });

  it('Evaluate pattern', function() {
    var storage = new q.Storage();
    storage.set('simple', 'really simple');
    storage.set('template1', 'text');
    storage.set('template2', 'templates');

    expect(q.parse.evalPattern('{{simple}}', ['simple'], storage)).
        toBe('really simple');

    expect(q.parse.evalPattern('some {{template1}} with different ' +
        '{{template2}} yo', ['template1', 'template2'], storage)).
        toBe('some text with different templates yo');
  });
});
