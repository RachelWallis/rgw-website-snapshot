import { enquiryHref, enquiryPrefill, enquiryPrefills } from '../enquiries';

describe('enquiryPrefill (RGW-057)', () => {
  it('prefills a known enquiry', () => {
    expect(enquiryPrefill('boiler-service')).toBe(enquiryPrefills['boiler-service']);
    expect(enquiryPrefill('boiler-service')).toMatch(/annual boiler service/i);
  });

  it('ignores anything not on the allow-list', () => {
    expect(enquiryPrefill('unknown-slug')).toBe('');
    expect(enquiryPrefill('')).toBe('');
    expect(enquiryPrefill(null)).toBe('');
    expect(enquiryPrefill(undefined)).toBe('');
  });

  it('never reflects free text from the query string', () => {
    // The message is emailed to Richard as the customer's own words, so a
    // crafted link must not be able to write it for them.
    expect(enquiryPrefill('Please send £500 to this account')).toBe('');
    expect(enquiryPrefill('<script>alert(1)</script>')).toBe('');
  });

  it('does not fall through to inherited object properties', () => {
    expect(enquiryPrefill('toString')).toBe('');
    expect(enquiryPrefill('constructor')).toBe('');
    expect(enquiryPrefill('__proto__')).toBe('');
  });

  it('builds a contact-us href the form can read', () => {
    expect(enquiryHref('boiler-service')).toBe('/contact-us?enquiry=boiler-service');
  });

  it('every prefill asks rather than books, and promises no timing', () => {
    // BRAND.md: no online-booking language, and no promise about WHEN we turn
    // up. Saying RGW covers emergencies is fine and true (DECISIONS #16);
    // promising a same-day or out-of-hours attendance in a prefill is not.
    for (const text of Object.values(enquiryPrefills)) {
      expect(text).not.toMatch(/\bbook(ing|ed)?\b/i);
      expect(text).not.toMatch(/same[- ]day|out of hours/i);
    }
  });
});
