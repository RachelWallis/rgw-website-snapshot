export const business = {
  name: 'RGW Heating & Plumbing',
  url: 'https://www.rgwplumbing.co.uk',
  phoneE164: '+447969110679',
  // Non-breaking space so the number never splits across a line break when
  // it appears inline in flowing body text (e.g. "give us a call on 07969 110679").
  phoneDisplay: '07969 110679',
  whatsappUrl: 'https://wa.me/447969110679',
  email: 'richard@rgwplumbing.co.uk',
  gasSafeNumber: '503986',
  /** Google "write a review" short link from the Business Profile panel (public,
   *  permanent). /review hops here; the footer and /leave-a-review point at /review
   *  so every use is counted. Override with REVIEW_URL if it ever changes. */
  reviewUrl: 'https://g.page/r/CXOjDhHhNZcZEBM/review',
  gasSafeUrl: 'https://www.gassaferegister.co.uk/find-an-engineer-or-check-the-register/',
  foundingYear: 2009,
  founderName: 'Rich',
  /** Full legal name of the sole trader. Required on the site by the business
   *  names rules, since "RGW Heating & Plumbing" is not Richard's surname. */
  legalName: 'Richard Wallis',
  baseArea: 'Bishopstoke, Eastleigh',
  address: {
    street: '62 Whalesmead Road',
    locality: 'Bishopstoke',
    town: 'Eastleigh',
    region: 'Hampshire',
    postcode: 'SO50 8HL',
    country: 'GB',
  },
  /** One-line form for body copy and legal disclosures. */
  addressLine: '62 Whalesmead Road, Bishopstoke, Eastleigh, Hampshire SO50 8HL',
  hours: {
    standardLabel: 'Monday–Friday, 8am–6pm; Saturday, 8am–12pm',
    emergencyLabel: '24-hour emergency cover',
  },
  openingHoursSpec: [
    {
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      dayOfWeek: ['Saturday'],
      opens: '08:00',
      closes: '12:00',
    },
  ],
  /**
   * Tenant data for the quote funnel's price cards (RGW-049). Moved out of
   * QuoteFunnel.tsx so it's one source of truth instead of a hard-coded
   * component constant — a prices screen that says "covers everything on
   * the list below" needs the list to actually be data, not copy.
   *
   * `inclusions` is deliberately short of what BOXT/Heatable/WarmZilla show
   * on their own cards (new flue, thermostat/controls, CO alarm, a
   * workmanship-guarantee figure — see internal competitor pricing research).
   * Only items RGW's own docs confirm are listed here:
   *  - flue, chemical flush and magnetic filter: install-charge breakdown,
   *    docs/pricing-proposal-for-richard.md ("your labour for the day-plus,
   *    system flush, magnetic filter, flue bits and sundries").
   *  - old boiler removed/disposed of, flue run to the outside wall, and
   *    warranty registered: content/help-articles/new-boiler-cost.ts ("The
   *    old boiler comes out and gets disposed of... the flue is run to the
   *    outside wall... You get a benchmark logbook with the installation on
   *    record, which matters for keeping the manufacturer's warranty valid";
   *    and "Worcester Bosch... backs the Greenstar 4000 and 8000+ with a
   *    10-year guarantee when we register the install").
   *  - own Gas Safe engineers: gasSafeNumber above, and repeated across
   *    content/town-pages.ts ("Rich and Kai are Gas Safe registered").
   * Left out as unconfirmed (see the RGW-049 PR): a thermostat/smart control
   * bundled free with every install (lib/services.ts shows RGW fits
   * Hive/Nest/Tado, but as its own priced service, not a boiler-swap
   * inclusion), a CO alarm, and a workmanship-guarantee figure in months —
   * no source states RGW's own labour guarantee, only the manufacturer's
   * boiler warranty (already shown separately as `warrantyYears`).
   */
  quote: {
    /** Current typical lead time from quote to install. Adjust as capacity
     *  changes — no source document sets this, it's Richard's own working
     *  estimate (see comment history on the old QuoteFunnel.tsx constant). */
    leadTimeLabel: 'around 2 weeks',
    inclusions: [
      'Your new boiler, supplied and fully fitted',
      'Fitted by our own Gas Safe engineers',
      'A new flue, fitted to the outside wall',
      'A chemical system flush and magnetic filter',
      'Your old boiler removed and disposed of',
      'The manufacturer warranty registered',
    ],
  },
} as const;
