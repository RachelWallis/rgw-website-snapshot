import { jsonLdScriptProps, serializeJsonLd } from '../schema';

describe('serializeJsonLd (RGW-061)', () => {
  it('never emits a literal </script> however the input tries', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script');
    expect(out).not.toContain('<');
    expect(out).not.toContain('>');
  });

  it('round-trips through JSON.parse unchanged', () => {
    const schema = {
      headline: 'Combi vs system: which is <right> & why?',
      n: 3,
      nested: { a: '<' },
    };
    expect(JSON.parse(serializeJsonLd(schema))).toEqual(schema);
  });

  it('escapes ampersands so entities cannot be smuggled', () => {
    expect(serializeJsonLd({ t: 'Heating & Plumbing' })).toBe('{"t":"Heating \\u0026 Plumbing"}');
  });

  it('jsonLdScriptProps uses the escaped form', () => {
    const props = jsonLdScriptProps({ name: '</script>' });
    expect(props.type).toBe('application/ld+json');
    expect(props.dangerouslySetInnerHTML.__html).toBe('{"name":"\\u003c/script\\u003e"}');
  });
});
