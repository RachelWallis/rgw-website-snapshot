'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IconAlertTriangle,
  IconArrowsMove,
  IconBath,
  IconBed,
  IconBrandWhatsapp,
  IconBuildingCottage,
  IconBuildingSkyscraper,
  IconCheck,
  IconClockHour4,
  IconCoin,
  IconCylinder,
  IconDeviceFloppy,
  IconDroplets,
  IconFlame,
  IconHelpCircle,
  IconHome2,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShieldCheck,
  IconStairs,
  IconX,
  type Icon as TablerIcon,
} from '@tabler/icons-react';
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Divider,
  Group,
  Image,
  List,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { track } from '@/lib/analytics';
import { business } from '@/lib/business';
import { testSubmissionHeaders } from '@/lib/testSubmission';
import { OPTION_SVG_MAP } from './optionIcons';

/**
 * `ApiOption.icon` is tenant data (an admin-set glyph/emoji or image URL —
 * see quote-direct's `OptionIn.icon` doc comment), never platform code. This
 * map lets a small set of known keywords render as a real Tabler icon
 * instead of a plain string, while anything else still falls through to a
 * literal glyph/emoji or an <img> for a URL — see `renderOptionIcon` below.
 */
/** Off-screen, not display:none, so naive bots still fill it (RGW-059). */
const HONEYPOT_STYLE: React.CSSProperties = {
  position: 'absolute',
  left: '-10000px',
  width: 1,
  height: 1,
  opacity: 0,
  overflow: 'hidden',
};

const OPTION_ICON_MAP: Record<string, TablerIcon> = {
  flame: IconFlame,
  cylinder: IconCylinder,
  help: IconHelpCircle,
  check: IconCheck,
  x: IconX,
  bed: IconBed,
  bath: IconBath,
  shower: IconDroplets,
  flat: IconBuildingSkyscraper,
  cottage: IconBuildingCottage,
  house: IconHome2,
  move: IconArrowsMove,
  stay: IconMapPin,
  cost: IconCoin,
  stairs: IconStairs,
};

function isImageUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || /\.(png|jpe?g|webp|svg|gif)$/i.test(value);
}

/** Renders an option's `icon` field: a known keyword -> Tabler icon, an
 *  http(s)/image-shaped string -> <img>, anything else (emoji, short glyph)
 *  -> the raw string. Returns null for no icon so callers can render
 *  label-only tiles without a gap where the icon would sit. */
function renderOptionIcon(icon: string | null | undefined, size = 28) {
  if (!icon) {
    return null;
  }
  const key = icon.trim().toLowerCase();
  // Inline SVG line diagrams (RGW-044) for the questions where a keyword-matched
  // Tabler glyph was wrong or ambiguous (boiler type, water tank, property).
  const svg = OPTION_SVG_MAP[key];
  if (svg) {
    return svg({ size });
  }
  const known = OPTION_ICON_MAP[key];
  if (known) {
    const IconComp = known;
    return <IconComp size={size} stroke={1.6} />;
  }
  if (isImageUrl(icon)) {
    // Plain <img>, not next/image: tenant-supplied URL, not a static site asset.
    return <img src={icon} alt="" width={size} height={size} style={{ objectFit: 'contain' }} />;
  }
  // Unknown keyword: nobody has drawn an icon for it, and it isn't an image.
  // Never fall back to a coincidentally-matching glyph — that is how "Standard
  // boiler" became a military tank (RGW-044). Fail visibly in development so a
  // new/typo'd fixture value is caught in review; render nothing in production
  // so it can never silently pick up a weapon because the word matched.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console -- intentional dev-only surfacing
    console.error(
      `[QuoteFunnel] no icon drawn for option keyword "${icon}" — add it to optionIcons.tsx (OPTION_SVG_MAP) or fix the fixture value.`
    );
    return (
      <Text
        aria-hidden="true"
        title={`no icon: ${icon}`}
        style={{
          fontSize: 12,
          lineHeight: 1,
          color: 'var(--mantine-color-red-6)',
          border: '1px dashed var(--mantine-color-red-6)',
          borderRadius: 4,
          padding: '1px 3px',
        }}
      >
        ?
      </Text>
    );
  }
  return null;
}

// Set NEXT_PUBLIC_QUICK_QUOTE_API_URL in .env.local (dev: http://localhost:3001)
// and in Vercel env (prod: https://quotedirect.uk — quote-direct's live custom
// domain, confirmed directly in quote-direct's own repo; the Vercel project
// is still named quick-quote but *.vercel.app is not the canonical prod URL)
const API_BASE = process.env.NEXT_PUBLIC_QUICK_QUOTE_API_URL ?? '';
const TENANT = 'rgw';
const PRODUCT = 'default'; // matches quick-quote's seeded product slug for tenant #1

// One-line reason to pick each tier (the "why choose this over that" answer).
// The warranty claims are derived from the packages actually shown (RGW-048):
// the mid card only says "longer warranty" when its warranty beats the value
// card's, and premium only says "longest" when it beats every other card —
// a 5-year mid next to a 5-year value card used to claim "longer" anyway.
function tierRationale(pkg: QuotePackage, shown: QuotePackage[]): string {
  if (pkg.tier === 'mid') {
    const value = shown.find((p) => p.tier === 'value');
    const longer = !!value && pkg.warrantyYears > value.warrantyYears;
    return longer
      ? 'The balance most people choose, a strong brand and a longer warranty without the top-tier price.'
      : 'The balance most people choose, a strong brand and a well-proven boiler without the top-tier price.';
  }
  if (pkg.tier === 'premium') {
    const others = shown.filter((p) => p.tier !== 'premium');
    const longest = others.length > 0 && others.every((p) => p.warrantyYears < pkg.warrantyYears);
    return longest
      ? 'Our best build quality and the longest warranty, for complete peace of mind.'
      : 'Our best build quality and highest efficiency, for complete peace of mind.';
  }
  return 'Our most affordable fully-fitted option, a reliable, efficient boiler from a trusted brand.';
}

/** Turns the tenant's inclusions list (lib/business.ts, RGW-049) into one
 *  short sentence for each price card, so a card states what it includes
 *  instead of leaving that to the shared checklist further down the page —
 *  competitor cards (BOXT, Heatable, WarmZilla) state theirs directly. */
function inclusionsLine(items: readonly string[]): string {
  const lower = items.map((item) => item.charAt(0).toLowerCase() + item.slice(1));
  if (lower.length <= 1) {
    return `Includes ${lower.join('')}.`;
  }
  return `Includes ${lower.slice(0, -1).join(', ')}, and ${lower[lower.length - 1]}.`;
}

function tierLabel(tier: string): string {
  if (tier === 'mid') {
    return 'Most popular';
  }
  if (tier === 'premium') {
    return 'Premium';
  }
  return 'Great value';
}

type ContactMethod = 'call' | 'whatsapp' | 'email' | 'save';

const CONTACT_METHODS: { value: ContactMethod; label: string; icon: typeof IconPhone }[] = [
  { value: 'call', label: 'Call me', icon: IconPhone },
  { value: 'whatsapp', label: 'WhatsApp me', icon: IconBrandWhatsapp },
  { value: 'email', label: 'Email me', icon: IconMail },
  { value: 'save', label: 'Just save my quote', icon: IconDeviceFloppy },
];

// Contact-method-specific copy for the input and the confirmation screen.
function methodContactField(method: ContactMethod): { label: string; placeholder: string } {
  if (method === 'email' || method === 'save') {
    return { label: 'Your email', placeholder: 'you@example.com' };
  }
  return { label: 'Your phone number', placeholder: '07700 000000' };
}

function methodWantsEmail(method: ContactMethod): boolean {
  return method === 'email' || method === 'save';
}

/* ------------------------------------------------------------------ */
/* Contact validation (RGW-048)                                         */
/* Same rules as quote-direct's src/lib/contactValidation.ts, which     */
/* /api/quote applies server-side: a typed contact that validates as    */
/* neither is a 400. Checking here first means Continue is never a dead */
/* click, and the message says which field to fix. Keep in sync.        */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** UK numbers: a leading `0` or `+44`, then 9-10 more digits; spaces,
 *  dashes and parentheses allowed as separators. */
function isValidUkPhone(value: string): boolean {
  const digitsOnly = value.replace(/[\s()-]/g, '');
  return /^(0\d{9,10}|\+44\d{9,10})$/.test(digitsOnly);
}

const CONTACT_EMAIL_ERROR = 'Please enter a valid email address.';
const CONTACT_PHONE_ERROR = 'Please enter a valid UK phone number.';
const CONTACT_REQUIRED_HINT =
  "Either one is fine. You'll choose exactly how we follow up in a moment.";

interface ContactCheck {
  ok: boolean;
  emailError: string | null;
  phoneError: string | null;
}

function checkContact(email: string, phone: string): ContactCheck {
  const e = email.trim();
  const p = phone.trim();
  const emailError = e && !isValidEmail(e) ? CONTACT_EMAIL_ERROR : null;
  const phoneError = p && !isValidUkPhone(p) ? CONTACT_PHONE_ERROR : null;
  const ok = !emailError && !phoneError && (!!e || !!p);
  return { ok, emailError, phoneError };
}

function methodSubmitLabel(method: ContactMethod): string {
  switch (method) {
    case 'call':
      return 'Request my callback';
    case 'whatsapp':
      return 'Get my quote on WhatsApp';
    case 'email':
      return 'Email me my quote';
    case 'save':
      return 'Save my quote';
  }
}

function methodNextStep(method: ContactMethod): string {
  switch (method) {
    case 'call':
      return "We'll call you to talk it through and arrange your free survey.";
    case 'whatsapp':
      return "We'll message you on WhatsApp to talk it through and arrange your free survey.";
    case 'email':
      return "We'll email you the details and arrange your free survey.";
    case 'save':
      return "We've saved your quote and emailed you a copy. Call us whenever you're ready.";
  }
}

/* ------------------------------------------------------------------ */
/* Types (mirrors QQ's DB question shape)                              */
/* ------------------------------------------------------------------ */

interface ApiOption {
  id: number;
  label: string;
  next_question_id: number | 'complete' | null;
  price_modifier: number;
  icon: string | null;
  /** Short "what to look for" copy shown under the label on the tile.
   *  Optional, tenant-set — undefined on older option rows until re-saved. */
  description?: string | null;
}

const NOT_SURE_RE = /not sure|don'?t know|not certain/i;

/** Stable sort that pushes "I'm not sure"/"I don't know"-shaped options to
 *  the end, regardless of the order the API returns them in — a display
 *  policy independent of (and a safety net for) the backend's own option
 *  ordering. Everything else keeps its relative order. */
function sortOptionsNotSureLast<T extends { label: string }>(options: T[]): T[] {
  const rest = options.filter((o) => !NOT_SURE_RE.test(o.label));
  const notSure = options.filter((o) => NOT_SURE_RE.test(o.label));
  return [...rest, ...notSure];
}

interface ApiQuestion {
  id: number;
  field: string;
  text: string;
  subtext: string;
  type: 'radio' | 'multi' | 'text' | 'stop';
  hint: string;
  validationKey: string | null;
  next_question_id: number | 'complete' | null;
  options: ApiOption[];
}

interface QuotePackage {
  tier: string;
  make: string;
  model: string;
  description: string;
  inclusions: string[];
  /** Present when this package is a best-effort pick for a property bigger
   *  than its tier is rated for — must be shown prominently, not buried. */
  caveat?: string;
  warrantyYears: number;
  total: number;
  boilerSupply: number;
  installation: number;
}

/** Why a quote produced no package (quote-direct QD-037). `message` is the
 *  tenant's own copy and is what the customer should read. */
interface SurveyNeeded {
  reason: 'type' | 'fit';
  message: string;
}

interface QuoteData {
  packages: QuotePackage[];
  leadId: number | null;
  leadToken: string | null;
  /** Set, with `packages` empty, when nothing could be priced. The API has
   *  already stored the lead for hand-pricing and told the installer. */
  surveyNeeded?: SurveyNeeded | null;
  /** One line on why the home was sized up for hot-water demand (QD-031).
   *  Absent when it wasn't; never show anything in that case. */
  highDemandNote?: string | null;
  /** Optional one-line note from the API to show under the options (QD-049). */
  conversionNote?: string | null;
}

type Screen =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  /** The API rate-limited the quote request; `answers` are what to re-send. */
  | { kind: 'busy'; answers: Record<string, string> }
  | { kind: 'question'; id: number }
  | { kind: 'stop'; questionId?: number; reason?: string }
  | { kind: 'results' }
  | { kind: 'booking'; pkg: QuotePackage }
  | { kind: 'confirmed' }
  | { kind: 'stop-confirmed' };

/** A message the API wrote for the customer (a 4xx `error` string), safe to
 *  show verbatim — unlike a thrown TypeError's "Failed to fetch". */
class ApiError extends Error {}

/** Surfaces the backend's validation message (e.g. "Please enter a valid
 *  phone number") on 4xx responses so users can fix their input, instead of
 *  a generic "something went wrong" that gives no clue what to change. */
async function apiErrorMessage(res: Response): Promise<string | null> {
  if (res.status < 400 || res.status >= 500) {
    return null;
  }
  try {
    const body = await res.json();
    return typeof body?.error === 'string' ? body.error : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Navigation helpers                                                   */
/* ------------------------------------------------------------------ */

function resolveNext(
  question: ApiQuestion,
  selected: string[],
  qmap: Map<number, ApiQuestion>
): number | 'results' | 'stop' {
  if (question.type === 'text' || question.type === 'stop') {
    const n = question.next_question_id;
    if (!n || n === 'complete') {
      return 'results';
    }
    return typeof n === 'number' ? n : 'results';
  }

  const chosen = question.options.filter((o) => selected.includes(o.label));
  if (!chosen.length) {
    return 'stop';
  }

  if (question.type === 'radio') {
    const n = chosen[0].next_question_id;
    if (n === 'complete') {
      return 'results';
    }
    if (n === null) {
      return 'stop';
    }
    return n;
  }

  // multi: follow most-quotable branch (mirrors QQ's resolveMultiNext)
  const continues = chosen.find(
    (o) => typeof o.next_question_id === 'number' && qmap.get(o.next_question_id)?.type !== 'stop'
  );
  if (continues) {
    return continues.next_question_id as number;
  }
  if (chosen.some((o) => o.next_question_id === 'complete')) {
    return 'results';
  }
  const toStop = chosen.find(
    (o) => typeof o.next_question_id === 'number' && qmap.get(o.next_question_id)?.type === 'stop'
  );
  if (toStop) {
    return toStop.next_question_id as number;
  }
  return 'stop';
}

function startId(qmap: Map<number, ApiQuestion>): number {
  const ids = Array.from(qmap.keys());
  return ids.length ? Math.min(...ids) : 1;
}

/** Answer fields the URL may pre-fill (RGW-054: the boiler kW calculator at
 *  /collection/boiler-kw-calculator hands its answers over this way). Only
 *  these keys are read, so a stray query param can never become an answer. */
const PREFILL_FIELDS = ['bedrooms', 'baths', 'showers', 'propertyType', 'knowBoilerType'];

/** `{ bedrooms: '3 bedrooms', ... }` from the current URL, values being the
 *  funnel's own option labels so the matching tile highlights. The customer
 *  still taps each question, so the funnel's branching is untouched; a label
 *  that matches nothing simply highlights nothing, and the tap overwrites it.
 *  Safe on the server (no window) and never throws. */
function readPrefill(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const out: Record<string, string> = {};
    for (const field of PREFILL_FIELDS) {
      const value = params.get(field)?.trim().slice(0, 40);
      if (value) {
        out[field] = value;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export function QuoteFunnel() {
  const [questions, setQuestions] = useState<Map<number, ApiQuestion> | null>(null);
  const [screen, setScreen] = useState<Screen>({ kind: 'loading' });
  const [history, setHistory] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [textValue, setTextValue] = useState('');
  const [checkingPostcode, setCheckingPostcode] = useState(false);

  // Two-field contact step (RGW-048): email + phone, at least one required.
  // Not cleared on back(), so returning to the step shows what was typed.
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactTouched, setContactTouched] = useState({ email: false, phone: false });
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Callback (stop screen)
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbSubmitting, setCbSubmitting] = useState(false);
  const [cbError, setCbError] = useState<string | null>(null);

  // Booking (package selected)
  const [bkName, setBkName] = useState('');
  const [bkContact, setBkContact] = useState('');
  const [bkMethod, setBkMethod] = useState<ContactMethod>('call');
  const [bkSubmitting, setBkSubmitting] = useState(false);
  const [bkError, setBkError] = useState<string | null>(null);

  // Bot signals (RGW-059). quote-direct checks both on /api/quote, /api/callback
  // and /api/book (its src/lib/spamGuard.ts, same field names as this repo's
  // lib/spam-guard.ts): a hidden `website` field a person never sees, and the
  // time the funnel mounted so a near-instant submit stands out. Tripping
  // either gets a normal-looking 200 with no lead stored and no email sent.
  const [website, setWebsite] = useState('');
  const startedAtRef = useRef(0);
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);
  function botSignals() {
    return { website, startedAt: startedAtRef.current };
  }
  function renderHoneypot() {
    return (
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.currentTarget.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={HONEYPOT_STYLE}
      />
    );
  }

  // Load questions
  useEffect(() => {
    fetch(`${API_BASE}/api/questions?tenant=${TENANT}&product=${PRODUCT}`)
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`Failed to load questions: ${r.status}`))
      )
      .then((rows: ApiQuestion[]) => {
        const map = new Map(rows.map((q) => [q.id, q]));
        setQuestions(map);
        setAnswers(readPrefill());
        setScreen({ kind: 'question', id: startId(map) });
      })
      .catch(() =>
        setScreen({ kind: 'error', message: 'Could not load the quote form, please call us.' })
      );
  }, []);

  const progress = useMemo(() => {
    if (!questions || screen.kind !== 'question') {
      return screen.kind === 'results' ? 100 : 0;
    }
    const total = questions.size || 12;
    return Math.min(95, Math.round((history.length / total) * 130));
  }, [questions, screen, history]);

  // Each step swaps in taller/shorter content at the same scroll position,
  // so a step change can leave the new content starting off-screen (e.g.
  // landing mid-way down the results card after a short question). Bring
  // the funnel back into view on every screen change, not just the first.
  const anchorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [screen.kind]);

  function startNewQuote() {
    setHistory([]);
    setAnswers({});
    setMultiSelected([]);
    setTextValue('');
    setContactEmail('');
    setContactPhone('');
    setContactTouched({ email: false, phone: false });
    setQuote(null);
    setBkName('');
    setBkContact('');
    setBkMethod('call');
    setBkError(null);
    setCbName('');
    setCbPhone('');
    setCbError(null);
    setScreen({ kind: 'question', id: questions ? startId(questions) : 1 });
  }

  /** `extra` carries additional named answers alongside the question's own
   *  field — the contact step sends `email` and `phone` (RGW-048), which is
   *  what /api/quote validates and stores (quote-direct QD-039). */
  function go(
    next: number | 'results' | 'stop',
    field: string,
    value: string,
    extra: Record<string, string> = {}
  ) {
    const newAnswers = { ...answers, ...extra, [field]: value };
    setAnswers(newAnswers);
    setTextValue('');
    setMultiSelected([]);

    // Remember where we came from for every forward move, so the stop screen
    // and the "we'll price this for you" result can offer "Back" too — a
    // mis-tap on "No mains gas" or an out-of-area postcode used to strand
    // people with only "Request a callback" or a page reload (RGW-033).
    const remember = () => {
      if (screen.kind === 'question') {
        setHistory((h) => [...h, screen.id]);
      }
    };

    if (typeof next === 'number' && questions?.get(next)?.type === 'stop') {
      remember();
      setScreen({ kind: 'stop', questionId: next });
    } else if (next === 'stop') {
      remember();
      setScreen({ kind: 'stop' });
    } else if (next === 'results') {
      remember();
      setScreen({ kind: 'results' });
      fetchQuote(newAnswers);
    } else {
      remember();
      setScreen({ kind: 'question', id: next });
    }
  }

  function back() {
    if (!history.length) {
      return;
    }
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setScreen({ kind: 'question', id: prev });
    setMultiSelected([]);
    setTextValue('');
  }

  async function fetchQuote(finalAnswers: Record<string, string>) {
    setLoadingQuote(true);
    try {
      const res = await fetch(`${API_BASE}/api/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...testSubmissionHeaders() },
        body: JSON.stringify({
          answers: finalAnswers,
          tenant: TENANT,
          product: PRODUCT,
          ...botSignals(),
        }),
      });
      const data = await res.json().catch(() => null);
      // Rate-limited (RGW-048): a 429, or the structured `error: 'rate_limited'`
      // body quote-direct is adding (QD-047). Nothing is wrong with the
      // answers, so say "busy" and offer a retry of the same request rather
      // than "we couldn't calculate your price".
      if (res.status === 429 || data?.error === 'rate_limited') {
        setScreen({ kind: 'busy', answers: finalAnswers });
        return;
      }
      if (!res.ok) {
        // Surface the API's own 4xx message (e.g. an invalid contact) so the
        // person knows what to change; 5xx gets the generic copy below.
        if (res.status < 500 && typeof data?.error === 'string') {
          throw new ApiError(data.error);
        }
        throw new Error(`quote failed: ${res.status}`);
      }
      if (!data || !Array.isArray(data.packages)) {
        throw new Error('quote response had no packages array');
      }
      setQuote(data);
      const packages: QuotePackage[] = data.packages;
      const headline = packages.find((p) => p.tier === 'mid') ?? packages[0];
      track('quote_completed', {
        method: 'instant_quote',
        value: headline?.total ?? 0,
        currency: 'GBP',
        // A no-package result still completes the funnel (the lead is stored
        // for hand-pricing), but it isn't a priced quote — tag it so.
        ...(packages.length ? {} : { outcome: 'survey_needed' }),
      });
    } catch (err) {
      // Screen changes away from 'results' entirely — without this, a failed
      // fetch left quote=null with loadingQuote=false, which the results
      // screen's `loadingQuote || !quote` check can't tell apart from
      // "still loading", so it spun forever with no way out.
      // Only a message the API wrote for the customer is shown as-is; a
      // network/CORS failure ("Failed to fetch") or a 5xx gets our own copy.
      setScreen({
        kind: 'error',
        message:
          err instanceof ApiError
            ? err.message
            : "We couldn't calculate your price. Please call us and we'll help directly.",
      });
    } finally {
      setLoadingQuote(false);
    }
  }

  async function submitCallback() {
    if (!cbName.trim() || !cbPhone.trim()) {
      setCbError('Please enter your name and phone number.');
      return;
    }
    if (!/\d{7,}/.test(cbPhone.replace(/[\s()+-]/g, ''))) {
      setCbError('Please enter a valid phone number.');
      return;
    }
    setCbSubmitting(true);
    setCbError(null);
    const stopQuestion =
      screen.kind === 'stop' && screen.questionId ? questions?.get(screen.questionId) : undefined;
    const stopReason = screen.kind === 'stop' ? screen.reason : undefined;
    // The "we'll price this for you" result (RGW-048) reuses this form; tell
    // Richard which lead it belongs to and why it couldn't be priced online.
    const survey = screen.kind === 'results' ? quote?.surveyNeeded : undefined;
    try {
      const res = await fetch(`${API_BASE}/api/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...testSubmissionHeaders() },
        body: JSON.stringify({
          name: cbName.trim(),
          phone: cbPhone.trim(),
          notes: stopQuestion
            ? `Service enquiry: ${stopQuestion.text}`
            : stopReason
              ? `Out of area, postcode: ${answers.postcode ?? 'unknown'}`
              : survey
                ? `Needs pricing by hand (${survey.reason})${quote?.leadId ? `, lead #${quote.leadId}` : ''}: ${survey.message}`
                : '',
          answers,
          tenant: TENANT,
          product: PRODUCT,
          ...botSignals(),
        }),
      });
      if (!res.ok) {
        throw new Error((await apiErrorMessage(res)) ?? undefined);
      }
      track('contact_form_sent', { form_context: 'callback' });
      track('lead_email_sent', { lead_type: 'callback' });
      setScreen({ kind: 'stop-confirmed' });
    } catch (err) {
      setCbError(
        err instanceof Error && err.message
          ? err.message
          : `Something went wrong, please call us on ${business.phoneDisplay}.`
      );
    } finally {
      setCbSubmitting(false);
    }
  }

  /** The contact the person already gave that suits a follow-up method:
   *  their email for email/save, their phone for call/WhatsApp (RGW-048).
   *  /api/book validates `contact` against the method, so the old combined
   *  "email / phone" line must never be sent as-is. */
  function contactForMethod(method: ContactMethod): string {
    const wanted = methodWantsEmail(method) ? answers.email : answers.phone;
    if (wanted) {
      return wanted;
    }
    // Older answers with only the combined line: use it only if it is a
    // single value of the right shape.
    const legacy = answers.contactDetails ?? '';
    const fits = methodWantsEmail(method) ? isValidEmail(legacy) : isValidUkPhone(legacy);
    return fits ? legacy : '';
  }

  async function submitBooking(pkg: QuotePackage) {
    if (!bkName.trim()) {
      setBkError('Please enter your name.');
      return;
    }
    const contact = bkContact.trim() || contactForMethod(bkMethod);
    if (!contact) {
      setBkError(
        methodWantsEmail(bkMethod) ? 'Please enter your email.' : 'Please enter your phone number.'
      );
      return;
    }
    if (methodWantsEmail(bkMethod) ? !isValidEmail(contact) : !isValidUkPhone(contact)) {
      setBkError(methodWantsEmail(bkMethod) ? CONTACT_EMAIL_ERROR : CONTACT_PHONE_ERROR);
      return;
    }
    if (!quote?.leadToken) {
      setBkError('Session error, please refresh and try again.');
      return;
    }
    setBkSubmitting(true);
    setBkError(null);
    try {
      const res = await fetch(`${API_BASE}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...testSubmissionHeaders() },
        body: JSON.stringify({
          leadToken: quote.leadToken,
          leadId: quote.leadId,
          name: bkName.trim(),
          contact,
          contactMethod: bkMethod,
          postcode: answers.postcode || '',
          model: `${pkg.make} ${pkg.model}`,
          total: pkg.total,
          // Always true: RGW's funnel never collects a booking date/slot for
          // any contact method (DECISIONS.md #9, "Booking is quote-only for
          // RGW... no dates, no online booking/payment, ever"). This used to
          // be `bkMethod === 'save'`, which meant call/whatsapp/email leads
          // were mis-tagged `status: 'booked'` in the leads admin even though
          // no date was ever arranged — only "save" was tagged correctly.
          quoteOnly: true,
          tenant: TENANT,
          product: PRODUCT,
          ...botSignals(),
        }),
      });
      if (!res.ok) {
        throw new Error((await apiErrorMessage(res)) ?? undefined);
      }
      track('quote_completed', {
        method: 'instant_quote',
        boiler_tier: pkg.tier,
        boiler_model: `${pkg.make} ${pkg.model}`,
        value: pkg.total,
        currency: 'GBP',
        option_selected: true,
      });
      // quote-direct's /api/book is the step that emails Richard.
      track('lead_email_sent', { lead_type: 'instant_quote', value: pkg.total, currency: 'GBP' });
      setScreen({ kind: 'confirmed' });
    } catch (err) {
      setBkError(
        err instanceof Error && err.message
          ? err.message
          : `Something went wrong, please call us on ${business.phoneDisplay}.`
      );
    } finally {
      setBkSubmitting(false);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */

  // Name + phone + "Request a callback", shared by the stop screen and the
  // "we'll price this for you" result (RGW-048). Both end in 'stop-confirmed'.
  function renderCallbackForm() {
    return (
      <>
        {renderHoneypot()}
        <TextInput
          label="Your name"
          placeholder="Jane Smith"
          value={cbName}
          onChange={(e) => setCbName(e.currentTarget.value)}
          autoComplete="name"
          required
        />
        <TextInput
          label="Phone number"
          placeholder="07700 000000"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={cbPhone}
          onChange={(e) => setCbPhone(e.currentTarget.value)}
          required
        />
        {cbError && (
          <Text c="red" size="sm">
            {cbError}
          </Text>
        )}
        <Button color="rgwBlue" loading={cbSubmitting} onClick={submitCallback} fullWidth>
          Request a callback
        </Button>
        <Text size="sm" ta="center" c="dimmed">
          Or call us now:{' '}
          <Anchor href={`tel:${business.phoneE164}`} fw={500}>
            {business.phoneDisplay}
          </Anchor>
        </Text>
      </>
    );
  }

  return (
    <div ref={anchorRef}>
      {(() => {
        if (screen.kind === 'loading') {
          return (
            <Center py={80}>
              <Loader color="rgwBlue" />
            </Center>
          );
        }

        if (screen.kind === 'error') {
          return (
            <Stack align="center" py={60} gap="md">
              <Text c="dimmed">{screen.message}</Text>
              <Anchor href={`tel:${business.phoneE164}`} fw={500}>
                {business.phoneDisplay}
              </Anchor>
            </Stack>
          );
        }

        if (screen.kind === 'busy') {
          const { answers: pending } = screen;
          return (
            <Card withBorder radius="lg" p="xl" maw={520} mx="auto">
              <Stack gap="lg">
                <Stack gap="xs">
                  <Title order={3}>We&apos;re busy right now</Title>
                  <Text c="dimmed">
                    Please try again in a minute. Your answers are saved, so it&apos;s one click.
                  </Text>
                </Stack>
                <Button
                  color="rgwBlue"
                  onClick={() => {
                    setScreen({ kind: 'results' });
                    fetchQuote(pending);
                  }}
                >
                  Retry
                </Button>
                <Text size="sm" ta="center" c="dimmed">
                  Or call us now:{' '}
                  <Anchor href={`tel:${business.phoneE164}`} fw={500}>
                    {business.phoneDisplay}
                  </Anchor>
                </Text>
              </Stack>
            </Card>
          );
        }

        if (screen.kind === 'stop-confirmed') {
          return (
            <Card withBorder radius="lg" p="xl" maw={520} mx="auto">
              <Stack gap="md" ta="center">
                <Title order={3} c="rgwBlue">
                  Got it, we'll call you soon
                </Title>
                <Text c="dimmed">
                  We'll be in touch to discuss your enquiry. In the meantime, feel free to call us
                  directly on{' '}
                  <Anchor href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</Anchor>.
                </Text>
                <Button variant="default" onClick={startNewQuote}>
                  Start a new quote
                </Button>
              </Stack>
            </Card>
          );
        }

        if (screen.kind === 'confirmed') {
          return (
            <Card withBorder radius="lg" p="xl" maw={520} mx="auto">
              <Stack gap="lg">
                <Stack gap="xs">
                  <Title order={3} c="rgwBlue">
                    Your quote is saved
                  </Title>
                  <Text c="dimmed">{methodNextStep(bkMethod)}</Text>
                </Stack>
                <Divider label="What happens next" labelPosition="center" />
                <List
                  spacing="sm"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon color="rgwBlue" size={20} radius="xl">
                      <IconCheck size={12} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>We get your quote ready and saved to your name.</List.Item>
                  <List.Item>
                    We get in touch the way you asked, to arrange a free survey.
                  </List.Item>
                  <List.Item>
                    One of our own Gas Safe engineers confirms everything on site, that&apos;s when
                    your price is locked in, with no surprises on the day.
                  </List.Item>
                  <List.Item>
                    We book your install, typically {business.quote.leadTimeLabel} away.
                  </List.Item>
                </List>
                <Text size="sm" c="dimmed">
                  Need it sooner, or have a question? Call us on{' '}
                  <Anchor href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</Anchor>.
                </Text>
                <Button variant="default" onClick={startNewQuote}>
                  Start a new quote
                </Button>
              </Stack>
            </Card>
          );
        }

        if (screen.kind === 'stop') {
          const stopQ = screen.questionId ? questions?.get(screen.questionId) : undefined;
          return (
            <Card withBorder radius="lg" p="xl" maw={520} mx="auto">
              <Stack gap="lg">
                <Stack gap="xs">
                  <Title order={3}>
                    {stopQ?.text ??
                      screen.reason ??
                      "This type of work isn't something we quote online, but we'd love to help"}
                  </Title>
                  {stopQ?.subtext ? (
                    <Text c="dimmed">{stopQ.subtext}</Text>
                  ) : (
                    <Text c="dimmed">
                      Leave your number and we'll call you back to discuss what you need.
                    </Text>
                  )}
                </Stack>
                {renderCallbackForm()}
                {history.length > 0 && (
                  <Box>
                    <Button variant="subtle" color="gray" size="sm" onClick={back}>
                      ← Back
                    </Button>
                  </Box>
                )}
              </Stack>
            </Card>
          );
        }

        if (screen.kind === 'results') {
          if (loadingQuote || !quote) {
            return (
              <Center py={80}>
                <Stack align="center" gap="md">
                  <Loader color="rgwBlue" size="lg" />
                  <Text c="dimmed">Calculating your indicative prices…</Text>
                </Stack>
              </Center>
            );
          }
          if (!quote.packages.length) {
            // Nothing could be priced online (RGW-048, quote-direct QD-037).
            // The API has stored the lead for hand-pricing and told Richard;
            // this screen says why in the tenant's words, and keeps every way
            // forward open: leave a number, go back, or start again.
            return (
              <Card withBorder radius="lg" p="xl" maw={520} mx="auto">
                <Stack gap="lg">
                  <Stack gap="xs">
                    <Title order={3}>We&apos;ll price this for you</Title>
                    <Text c="dimmed">
                      {quote.surveyNeeded?.message ??
                        "We couldn't put a price on this online from your answers, so we'll price it by hand instead."}
                    </Text>
                    <Text c="dimmed">
                      Want to talk it through now? Call us on{' '}
                      <Anchor href={`tel:${business.phoneE164}`} fw={500}>
                        {business.phoneDisplay}
                      </Anchor>
                      .
                    </Text>
                  </Stack>
                  <Divider label="Or leave your number and we'll call you" labelPosition="center" />
                  {renderCallbackForm()}
                  <Group justify="space-between">
                    <Button
                      variant="subtle"
                      color="gray"
                      size="sm"
                      onClick={back}
                      disabled={!history.length}
                    >
                      ← Back
                    </Button>
                    <Button variant="default" size="sm" onClick={startNewQuote}>
                      Start again
                    </Button>
                  </Group>
                </Stack>
              </Card>
            );
          }
          return (
            <Stack gap="xl">
              <Stack gap="xs" ta="center">
                <Title order={2}>Your indicative price options</Title>
                <Text c="dimmed" maw={660} mx="auto">
                  Each price is fully fitted, VAT included, and covers everything on the list below.
                  It&apos;s an indicative price, your free survey confirms and locks it in.
                </Text>
              </Stack>

              <Card withBorder radius="lg" p="lg">
                <Group wrap="nowrap" align="center" gap="lg">
                  <Image
                    src="/images/richKai.webp"
                    alt="Rich and Kai, RGW's own Gas Safe engineers"
                    w={110}
                    h={110}
                    radius="lg"
                    fit="cover"
                  />
                  <Stack gap={6}>
                    <Group gap="xs" wrap="nowrap">
                      <IconClockHour4 size={18} color="var(--mantine-color-rgwBlue-6)" />
                      <Text fw={600}>Current lead time: {business.quote.leadTimeLabel}</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Your boiler is fitted by Rich and Kai, our own Gas Safe engineers. Need it
                      sooner? Call us on{' '}
                      <Anchor href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</Anchor>{' '}
                      and we&apos;ll do our best to help.
                    </Text>
                  </Stack>
                </Group>
              </Card>

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                {quote.packages.map((pkg) => (
                  <Card key={pkg.tier} withBorder radius="lg" p="lg">
                    <Stack gap="md" h="100%">
                      <Stack gap={4}>
                        <Text size="xs" tt="uppercase" fw={700} c="rgwOrange">
                          {tierLabel(pkg.tier)}
                        </Text>
                        <Title order={4}>
                          {pkg.make} {pkg.model}
                        </Title>
                        <Text size="sm" c="dimmed">
                          {pkg.description}
                        </Text>
                      </Stack>
                      {pkg.warrantyYears > 0 && (
                        <Badge color="rgwBlue" variant="light" radius="sm">
                          {pkg.warrantyYears}-year manufacturer warranty
                        </Badge>
                      )}
                      <Text size="sm" c="dimmed">
                        {tierRationale(pkg, quote.packages)}
                      </Text>
                      <Text size="xs" c="dimmed" data-testid="card-inclusions">
                        {inclusionsLine(business.quote.inclusions)}
                      </Text>
                      {pkg.caveat && (
                        <Alert
                          color="orange"
                          variant="light"
                          icon={<IconAlertTriangle size={18} />}
                          title="Worth knowing"
                        >
                          {pkg.caveat}
                        </Alert>
                      )}
                      <Box mt="auto">
                        <Title order={2} c="rgwBlue">
                          £{pkg.total.toLocaleString()}
                        </Title>
                        <Text size="xs" c="dimmed">
                          fully fitted inc. VAT
                        </Text>
                      </Box>
                      <Button
                        color="rgwOrange"
                        fullWidth
                        onClick={() => {
                          setBkName('');
                          setBkContact(contactForMethod('call'));
                          setBkMethod('call');
                          setBkError(null);
                          setScreen({ kind: 'booking', pkg });
                        }}
                      >
                        Choose this option
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Notes from the pricing engine (RGW-048): why the home was
                  sized up for hot-water demand (QD-031) and an optional
                  conversion note (QD-049). Only rendered when the API set
                  them — never re-derived here. */}
              {(quote.highDemandNote || quote.conversionNote) && (
                <Stack gap="xs" maw={660} mx="auto" w="100%">
                  {quote.highDemandNote && (
                    <Alert
                      variant="light"
                      color="rgwBlue"
                      icon={<IconInfoCircle size={18} />}
                      data-testid="high-demand-note"
                    >
                      {quote.highDemandNote}
                    </Alert>
                  )}
                  {quote.conversionNote && (
                    <Alert
                      variant="light"
                      color="rgwBlue"
                      icon={<IconInfoCircle size={18} />}
                      data-testid="conversion-note"
                    >
                      {quote.conversionNote}
                    </Alert>
                  )}
                </Stack>
              )}

              <Card withBorder radius="lg" p="lg">
                <Stack gap="md">
                  <Title order={4}>Every price includes, as standard</Title>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs" verticalSpacing="xs">
                    {business.quote.inclusions.map((inc) => (
                      <Group key={inc} gap="xs" wrap="nowrap" align="flex-start">
                        <ThemeIcon color="rgwBlue" variant="light" size={22} radius="xl">
                          <IconCheck size={14} />
                        </ThemeIcon>
                        <Text size="sm">{inc}</Text>
                      </Group>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Card>

              <Card withBorder radius="lg" p="lg">
                <Stack gap="md">
                  <Title order={4}>What happens next</Title>
                  <List
                    spacing="sm"
                    size="sm"
                    type="ordered"
                    icon={
                      <ThemeIcon color="rgwBlue" size={20} radius="xl">
                        <IconCheck size={12} />
                      </ThemeIcon>
                    }
                  >
                    <List.Item>Choose the boiler that fits your home and budget.</List.Item>
                    <List.Item>
                      We arrange a time to visit and inspect your property in person.
                    </List.Item>
                    <List.Item>
                      We check the details that matter, pipework, gas supply, access, on site, so
                      you don&apos;t get hit with a price increase once the work has started.
                    </List.Item>
                    <List.Item>Your price is confirmed and locked in before we begin.</List.Item>
                  </List>
                </Stack>
              </Card>

              <Group justify="center" gap="xs" wrap="nowrap" maw={640} mx="auto">
                <IconShieldCheck
                  size={20}
                  color="var(--mantine-color-rgwBlue-6)"
                  style={{ flexShrink: 0 }}
                />
                <Text size="sm" c="dimmed" ta="center">
                  Because we survey in person, the price we confirm is the price you pay, with no
                  surprise charges on the day.
                </Text>
              </Group>
            </Stack>
          );
        }

        if (screen.kind === 'booking') {
          const { pkg } = screen;
          const contactField = methodContactField(bkMethod);
          return (
            <Card withBorder radius="lg" p="xl" maw={520} mx="auto">
              <Stack gap="lg">
                <Stack gap={4}>
                  <Title order={3}>Confirm your choice</Title>
                  <Text c="dimmed">
                    {pkg.make} {pkg.model}, <strong>£{pkg.total.toLocaleString()}</strong> fully
                    fitted
                  </Text>
                </Stack>

                <Stack gap="xs">
                  <Text size="sm" fw={500}>
                    How would you like us to follow up?
                  </Text>
                  <SimpleGrid cols={2} spacing="xs">
                    {CONTACT_METHODS.map((m) => {
                      const selected = bkMethod === m.value;
                      return (
                        <Button
                          key={m.value}
                          variant={selected ? 'filled' : 'default'}
                          color={selected ? 'rgwBlue' : undefined}
                          justify="flex-start"
                          leftSection={<m.icon size={18} />}
                          onClick={() => {
                            // Swap the prefilled contact to the kind this
                            // method needs, unless the person typed their own.
                            setBkContact((c) =>
                              c === '' || c === contactForMethod(bkMethod)
                                ? contactForMethod(m.value)
                                : c
                            );
                            setBkMethod(m.value);
                          }}
                          h="auto"
                          py={8}
                          styles={{
                            label: { whiteSpace: 'normal', textAlign: 'left', lineHeight: 1.2 },
                          }}
                        >
                          {m.label}
                        </Button>
                      );
                    })}
                  </SimpleGrid>
                </Stack>

                {renderHoneypot()}
                <TextInput
                  label="Your name"
                  placeholder="Jane Smith"
                  value={bkName}
                  onChange={(e) => setBkName(e.currentTarget.value)}
                  required
                />
                <TextInput
                  label={contactField.label}
                  description={
                    bkMethod === 'save'
                      ? 'So we can save your quote for you to pick up later'
                      : 'So we can reach you to arrange the free survey'
                  }
                  placeholder={contactField.placeholder}
                  type={methodWantsEmail(bkMethod) ? 'email' : 'tel'}
                  inputMode={methodWantsEmail(bkMethod) ? 'email' : 'tel'}
                  autoComplete={methodWantsEmail(bkMethod) ? 'email' : 'tel'}
                  value={bkContact}
                  onChange={(e) => setBkContact(e.currentTarget.value)}
                  required
                />
                {bkError && (
                  <Text c="red" size="sm">
                    {bkError}
                  </Text>
                )}
                <Group grow>
                  <Button
                    variant="default"
                    onClick={() => setScreen({ kind: 'results' })}
                    disabled={bkSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    color="rgwBlue"
                    loading={bkSubmitting}
                    onClick={() => submitBooking(pkg)}
                    h="auto"
                    py={8}
                    styles={{
                      label: { whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.2 },
                    }}
                  >
                    {methodSubmitLabel(bkMethod)}
                  </Button>
                </Group>
                <Text size="xs" ta="center" c="dimmed">
                  This is an indicative fitted price. A free survey confirms and locks it in.
                </Text>
              </Stack>
            </Card>
          );
        }

        // screen.kind === 'question'
        const question = questions?.get(screen.id);
        if (!question) {
          return (
            <Stack align="center" py={60} gap="md">
              <Text c="dimmed">
                Something went wrong. Please call us on{' '}
                <Anchor href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</Anchor>.
              </Text>
            </Stack>
          );
        }

        const isMulti = question.type === 'multi';
        const isContact = question.type === 'text' && question.validationKey === 'contactCheck';
        const isText = question.type === 'text' && !isContact;

        function advance(selected: string[]) {
          const value = selected.join(', ');
          const next = resolveNext(question!, selected, questions!);
          go(next, question!.field, value);
        }

        // Two-field contact step (RGW-048): the question's own field keeps
        // the combined "email / phone" line for anything still reading it;
        // `email` and `phone` go alongside as the validated, structured
        // answers /api/quote stores (quote-direct QD-039).
        const contact = checkContact(contactEmail, contactPhone);
        function advanceContact() {
          setContactTouched({ email: true, phone: true });
          if (!contact.ok) {
            return;
          }
          const email = contactEmail.trim();
          const phone = contactPhone.trim();
          const next = resolveNext(question!, [], questions!);
          go(next, question!.field, [email, phone].filter(Boolean).join(' / '), {
            ...(email ? { email } : {}),
            ...(phone ? { phone } : {}),
          });
        }

        async function advanceText(value: string) {
          if (question!.validationKey !== 'postcodeCheck') {
            advance([value]);
            return;
          }
          setCheckingPostcode(true);
          try {
            const res = await fetch(
              `${API_BASE}/api/postcode-check?tenant=${TENANT}&postcode=${encodeURIComponent(value)}`
            );
            const { covered } = res.ok ? await res.json() : { covered: true }; // fail open, don't block on our own error
            if (!covered) {
              setAnswers((a) => ({ ...a, [question!.field]: value }));
              setTextValue('');
              setHistory((h) => [...h, question!.id]);
              setScreen({
                kind: 'stop',
                reason: "We don't currently cover this postcode, but we'd love to help",
              });
              return;
            }
            advance([value]);
          } finally {
            setCheckingPostcode(false);
          }
        }

        return (
          <Card withBorder radius="lg" p="xl" maw={520} mx="auto">
            <Stack gap="xl">
              <Progress value={progress} color="rgwBlue" size="sm" radius="xl" />

              <Stack gap="xs">
                <Title order={3}>{question.text}</Title>
                {question.subtext && <Text c="dimmed">{question.subtext}</Text>}
                {!isText &&
                  !isMulti &&
                  question.options?.some((o) => o.label === answers[question.field]) && (
                    <Text size="sm" c="rgwBlue.8">
                      Your earlier answer is highlighted. Tap it to confirm, or pick another.
                    </Text>
                  )}
                {question.hint && (
                  <Text size="sm" c="dimmed" fs="italic">
                    {question.hint}
                  </Text>
                )}
              </Stack>

              {isContact && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    advanceContact();
                  }}
                  noValidate
                >
                  <Stack gap="md">
                    {renderHoneypot()}
                    <TextInput
                      label="Email address"
                      placeholder="you@example.com"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      size="md"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.currentTarget.value)}
                      onBlur={() => setContactTouched((t) => ({ ...t, email: true }))}
                      error={contactTouched.email ? contact.emailError : null}
                      description="So we can send you a copy of your quote."
                    />
                    <TextInput
                      label="Phone number"
                      placeholder="07700 000000"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      size="md"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.currentTarget.value)}
                      onBlur={() => setContactTouched((t) => ({ ...t, phone: true }))}
                      error={contactTouched.phone ? contact.phoneError : null}
                      description={CONTACT_REQUIRED_HINT}
                    />
                    <Button type="submit" color="rgwBlue" disabled={!contact.ok}>
                      Continue
                    </Button>
                    <Text size="xs" c="dimmed">
                      By continuing you agree we can follow up about this quote — you&apos;ll choose
                      exactly how (call, text, WhatsApp or email) in a moment. We never use your
                      details for marketing or share them with anyone else.
                    </Text>
                  </Stack>
                </form>
              )}

              {isText && (
                <Stack gap="md">
                  <TextInput
                    placeholder=""
                    value={textValue}
                    onChange={(e) => setTextValue(e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && textValue.trim() && !checkingPostcode) {
                        advanceText(textValue.trim());
                      }
                    }}
                    size="md"
                  />
                  <Button
                    color="rgwBlue"
                    disabled={!textValue.trim()}
                    loading={checkingPostcode}
                    onClick={() => advanceText(textValue.trim())}
                  >
                    Continue
                  </Button>
                </Stack>
              )}

              {!isText && isMulti && (
                <Stack gap="md">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                    {(question.options ?? []).map((opt) => {
                      const selected = multiSelected.includes(opt.label);
                      return (
                        <Button
                          key={opt.label}
                          variant={selected ? 'filled' : 'default'}
                          color={selected ? 'rgwBlue' : undefined}
                          size="md"
                          styles={{
                            root: {
                              height: 'auto',
                              padding: '12px 16px',
                              whiteSpace: 'normal',
                              textAlign: 'left',
                            },
                          }}
                          onClick={() => {
                            setMultiSelected((prev) =>
                              prev.includes(opt.label)
                                ? prev.filter((l) => l !== opt.label)
                                : [...prev, opt.label]
                            );
                          }}
                        >
                          <Group gap="xs" wrap="nowrap">
                            <Checkbox
                              checked={selected}
                              readOnly
                              tabIndex={-1}
                              size="sm"
                              styles={{ input: { cursor: 'pointer' } }}
                            />
                            <Text size="sm" fw={500}>
                              {opt.label}
                            </Text>
                          </Group>
                        </Button>
                      );
                    })}
                  </SimpleGrid>

                  <Button
                    color="rgwBlue"
                    disabled={!multiSelected.length}
                    onClick={() => advance(multiSelected)}
                  >
                    Continue
                  </Button>
                </Stack>
              )}

              {/* Single-choice (radio) questions render as a grid of square tiles —
            icon + label + optional "what to look for" description — rather
            than a full-width vertical button stack, so 2-4 short options sit
            together instead of pushing page content down/getting obscured by
            fixed-position elements like ContactRail. "I'm not sure"/"I don't
            know"-shaped options always sort last regardless of API order,
            since the API's own option order isn't guaranteed (see
            quote-direct's questions route for the underlying fix). */}
              {!isText && !isMulti && !isContact && (
                <SimpleGrid cols={{ base: 2 }} spacing="sm">
                  {sortOptionsNotSureLast(question.options ?? []).map((opt) => {
                    const icon = renderOptionIcon(opt.icon);
                    // An answer already held for this field (carried in from the
                    // kW calculator, RGW-054, or given before pressing Back) is
                    // shown highlighted; the tap still confirms it.
                    const preset = answers[question.field] === opt.label;
                    return (
                      <Button
                        key={opt.label}
                        variant={preset ? 'light' : 'default'}
                        color={preset ? 'rgwBlue' : undefined}
                        aria-pressed={preset}
                        size="md"
                        styles={{
                          root: {
                            height: 'auto',
                            minHeight: 104,
                            padding: '14px 10px',
                            whiteSpace: 'normal',
                          },
                          inner: { height: '100%' },
                          label: { width: '100%' },
                        }}
                        onClick={() => advance([opt.label])}
                      >
                        <Stack gap={4} align="center" ta="center" style={{ width: '100%' }}>
                          {icon}
                          <Text size="sm" fw={600}>
                            {opt.label}
                          </Text>
                          {opt.description && (
                            <Text size="xs" c="dimmed" lh={1.3}>
                              {opt.description}
                            </Text>
                          )}
                        </Stack>
                      </Button>
                    );
                  })}
                </SimpleGrid>
              )}

              {history.length > 0 && (
                <Box>
                  <Button variant="subtle" color="gray" size="sm" onClick={back}>
                    ← Back
                  </Button>
                </Box>
              )}
            </Stack>
          </Card>
        );
      })()}
    </div>
  );
}
