import type { Metadata } from 'next';
import {
  Alert,
  Anchor,
  Container,
  List,
  ListItem,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Title,
} from '@mantine/core';
import { business } from '@/lib/business';

/**
 * Privacy & cookie notice.
 *
 * Written against what the code actually does (see docs/measurement-plan.md and
 * the /api/quote + /api/contact routes) rather than from a generic template —
 * a notice that misdescribes the processing is worse than none.
 *
 * ⚠️ UNCONFIRMED DETAILS — see `pending` below. The page reads correctly without
 * them (the address falls back to "available on request", which is a reasonable
 * position for a sole trader working from home), but they should be filled in.
 * A reminder renders in development only — never to customers, who should not be
 * shown a banner announcing that our privacy notice is unfinished.
 */
const pending = {
  /** Full legal name of the sole trader (the data controller). */
  controllerLegalName: business.legalName as string | null,
  /**
   * Published deliberately. The business names rules (Companies Act 2006
   * Part 41 / Trading Disclosures Regulations 2015) require a UK address for
   * service on the website, since "RGW Heating & Plumbing" is not Richard's
   * surname — and it is already public on Google Business Profile, so showing
   * it here costs no additional privacy and adds local credibility.
   */
  postalAddress: business.addressLine as string | null,
  /**
   * ICO data-protection fee registration number, if he is registered. RGW may
   * fall inside the exemption for processing limited to accounts/records and
   * marketing its own business — the ICO self-assessment settles it. If exempt,
   * leave this null and the sentence simply doesn't render.
   */
  icoRegistrationNumber: null as string | null,
} as const;

const unresolved = Object.entries(pending)
  .filter(([, v]) => !v)
  .map(([k]) => k);

const LAST_UPDATED = '10 August 2026';
/** GA4 property data retention, per docs/measurement-plan.md §3. */
const GA4_RETENTION = '14 months';

export const metadata: Metadata = {
  title: 'Privacy & cookie notice',
  description:
    'How RGW Heating & Plumbing collects, uses and protects your personal information, and the cookies this website uses.',
  robots: { index: true, follow: true },
};

type Row = { what: string; why: string; basis: string };

const dataRows: Row[] = [
  {
    what: 'Instant quote: your name, phone number, full postcode, and optionally your email address and any notes you add, together with your answers about your home and boiler and the option you picked.',
    why: 'So we can call you back, work out an accurate price and arrange a free survey.',
    basis: 'Steps taken at your request before entering a contract.',
  },
  {
    what: 'Contact form: your name, email address, phone number if you give one, and your message.',
    why: 'To answer your enquiry.',
    basis: 'Steps taken at your request before entering a contract.',
  },
  {
    what: 'Calls, texts and WhatsApp messages you send us.',
    why: 'To answer you and to arrange work.',
    basis: 'Steps taken at your request, or our legitimate interest in responding to enquiries.',
  },
  {
    what: 'Your IP address, held very briefly in memory when you submit a quote.',
    why: 'To limit how many submissions can come from one place in ten minutes, which stops the form being abused by bots. It is not written to a database and is not used to identify you.',
    basis: 'Our legitimate interest in keeping the site working and free of spam.',
  },
  {
    what: 'Website analytics — pages viewed, which buttons and phone links were tapped, and the first part of your postcode only (for example SO50, never SO50 4AB).',
    why: 'To understand which pages are useful and where people get stuck, so we can improve the site.',
    basis: 'Your consent. Nothing is collected unless you accept analytics cookies.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Container size="md" py={{ base: 48, md: 80 }}>
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1}>Privacy &amp; cookie notice</Title>
          <Text c="dimmed" size="sm">
            Last updated: {LAST_UPDATED}
          </Text>
        </Stack>

        {process.env.NODE_ENV !== 'production' && unresolved.length > 0 && (
          <Alert color="orange" title="Dev-only reminder — not shown to visitors">
            <Text size="sm">
              Still to confirm in <code>app/privacy-policy/page.tsx</code>: {unresolved.join(', ')}.
              The page is publishable without them, but they should be filled in.
            </Text>
          </Alert>
        )}

        <Text>
          This notice explains what personal information {business.name} collects when you use{' '}
          {business.url.replace('https://', '')}, why we collect it, who we share it with and what
          rights you have. We have tried to write it in plain English rather than legal boilerplate.
        </Text>

        <Stack gap="sm">
          <Title order={2} size="h3">
            Who we are
          </Title>
          <Text>
            {business.name} is a sole trader based in {business.baseArea}, Hampshire, Gas Safe
            registered under number {business.gasSafeNumber}. We are the data controller for the
            information described here, which means we decide how and why it is used.
          </Text>
          <Text>
            {pending.controllerLegalName ? (
              <>
                {business.name} is a trading name of {pending.controllerLegalName}.{' '}
              </>
            ) : null}
            {pending.postalAddress ? (
              <>
                Our address for correspondence, and for the service of documents, is{' '}
                {pending.postalAddress}.{' '}
              </>
            ) : (
              <>Our postal address for data-protection correspondence is available on request. </>
            )}
            {pending.icoRegistrationNumber ? (
              <>
                We are registered with the Information Commissioner&rsquo;s Office under reference{' '}
                {pending.icoRegistrationNumber}.
              </>
            ) : null}
          </Text>
          <Text>
            The quickest way to reach us about anything on this page is to email{' '}
            <Anchor href={`mailto:${business.email}`}>{business.email}</Anchor> or call{' '}
            <Anchor href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</Anchor>.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={2} size="h3">
            What we collect, and why
          </Title>
          <Table striped withTableBorder verticalSpacing="sm" horizontalSpacing="md">
            <TableThead>
              <TableTr>
                <TableTh style={{ width: '40%' }}>What</TableTh>
                <TableTh style={{ width: '32%' }}>Why</TableTh>
                <TableTh style={{ width: '28%' }}>Our lawful basis</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>
              {dataRows.map((row) => (
                <TableTr key={row.what}>
                  <TableTd>{row.what}</TableTd>
                  <TableTd>{row.why}</TableTd>
                  <TableTd>{row.basis}</TableTd>
                </TableTr>
              ))}
            </TableTbody>
          </Table>
          <Text size="sm" c="dimmed">
            We do not ask for, and you should not send us, information about your health, finances
            or anything else sensitive. We never sell your information, and we do not use it to
            build advertising profiles.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={2} size="h3">
            Who else handles your information
          </Title>
          <Text>
            We keep the list of companies involved as short as we sensibly can. Each of them acts on
            our instructions.
          </Text>
          <List spacing="sm">
            <ListItem>
              <b>Resend</b> — delivers the email that reaches us when you submit the quote or
              contact form. The details you entered are contained in that email.
            </ListItem>
            <ListItem>
              <b>Vercel</b> — hosts this website. Their servers process your request, including your
              IP address, in order to send you the page, and keep short-lived operational logs.
            </ListItem>
            <ListItem>
              <b>Google Analytics (Google Ireland Limited)</b> — website analytics, but{' '}
              <b>only if you accept analytics cookies</b>. Data is held for {GA4_RETENTION} and then
              deleted automatically. We have turned off Google&rsquo;s advertising personalisation
              features, and we do not send Google your name, email address, phone number or full
              postcode.
            </ListItem>
            <ListItem>
              <b>Google (reviews)</b> — the reviews shown on this site are fetched from our public
              Google Business Profile using Google&rsquo;s Places API. This happens on our server,
              not in your browser, so simply reading a page does not send anything about you to
              Google for this purpose.
            </ListItem>
          </List>
          <Text size="sm" c="dimmed">
            Google LLC participates in the UK Extension to the EU&ndash;US Data Privacy Framework,
            which is the safeguard relied on where information reaches the United States.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={2} size="h3">
            Cookies and similar technologies
          </Title>
          <Text>
            This site sets nothing on your device until you choose. Before you answer the banner,
            Google Analytics is not even downloaded — there are no analytics cookies and no requests
            to Google.
          </Text>
          <List spacing="sm">
            <ListItem>
              <b>Your cookie choice</b> — when you press Accept or Decline we store that one answer
              in your browser (under <code>rgw-consent</code>) so we can honour it and stop asking.
              This is necessary to respect your choice, so it does not itself require consent.
            </ListItem>
            <ListItem>
              <b>Google Analytics cookies</b> (<code>_ga</code> and <code>_ga_&lt;id&gt;</code>) —
              only set if you accept. They tell us whether visits belong to the same person, without
              telling us who you are.
            </ListItem>
          </List>
          <Text>
            You can change your mind at any time using the <b>Cookie settings</b> link at the bottom
            of any page. Declining costs you nothing — the whole site works either way. If you
            decline after previously accepting, we expire the analytics cookies.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={2} size="h3">
            How long we keep things
          </Title>
          <List spacing="sm">
            <ListItem>
              <b>Enquiries that do not become work</b> — kept while we are dealing with them and for
              a reasonable period afterwards in case you come back to us, then deleted.
            </ListItem>
            <ListItem>
              <b>Records of work we have carried out</b> — kept for at least six years. We are
              required to keep tax and safety records, and for gas work an older record can matter
              years later.
            </ListItem>
            <ListItem>
              <b>Analytics</b> — {GA4_RETENTION}, then deleted by Google automatically.
            </ListItem>
            <ListItem>
              <b>IP addresses used for rate limiting</b> — held in memory for ten minutes at most
              and never written to disk.
            </ListItem>
          </List>
        </Stack>

        <Stack gap="sm">
          <Title order={2} size="h3">
            Your rights
          </Title>
          <Text>Under UK data protection law you can ask us to:</Text>
          <List spacing="xs">
            <ListItem>tell you what we hold about you, and give you a copy;</ListItem>
            <ListItem>correct anything that is wrong;</ListItem>
            <ListItem>
              delete it, where we do not have to keep it for tax or gas-safety reasons;
            </ListItem>
            <ListItem>restrict or object to what we are doing with it;</ListItem>
            <ListItem>
              provide it in a portable format, where we are relying on your consent or a contract;
            </ListItem>
            <ListItem>
              withdraw consent to analytics at any time, using the Cookie settings link.
            </ListItem>
          </List>
          <Text>
            Email <Anchor href={`mailto:${business.email}`}>{business.email}</Anchor> and we will
            respond within one month. There is no charge.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={2} size="h3">
            Complaints
          </Title>
          <Text>
            If you are unhappy with how we have handled your information, please tell us first and
            we will try to put it right. You also have the right to complain to the Information
            Commissioner&rsquo;s Office at{' '}
            <Anchor
              href="https://ico.org.uk/make-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ico.org.uk/make-a-complaint
            </Anchor>{' '}
            or on 0303 123 1113.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={2} size="h3">
            Changes to this notice
          </Title>
          <Text>
            If we change how we handle your information we will update this page and the date at the
            top. This notice was last updated on {LAST_UPDATED}.
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
