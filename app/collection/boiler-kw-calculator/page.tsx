import type { Metadata } from 'next';
import { Anchor, Container, List, ListItem, Stack, Text, Title } from '@mantine/core';
import { KwCalculator } from '@/components/KwCalculator/KwCalculator';
import { QuoteCta } from '@/components/QuoteCta/QuoteCta';
import { business } from '@/lib/business';
import { pageOpenGraph } from '@/lib/og';
import { breadcrumbSchema, faqPageSchema, jsonLdScriptProps } from '@/lib/schema';

/**
 * /collection/boiler-kw-calculator (RGW-054). This exact URL lived on the old
 * Framer site and is still the page Google shows most from this domain, in
 * AI features and in web search, so it is served here rather than swept to
 * /help-and-advice by the /collection/:slug redirect in next.config.mjs
 * (which now excludes it). Same layout as a help article, with the
 * calculator in place of the body.
 */

const title = 'Boiler kW calculator: what size combi boiler do I need?';
const description =
  'Work out what size boiler your home needs in kW. Enter bedrooms, baths and showers to get the combi size band we would fit, and whether a system boiler is the better answer.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/collection/boiler-kw-calculator' },
  openGraph: pageOpenGraph('helpAndAdvice', { title, description }),
};

const faqs = [
  {
    question: 'What does kW mean on a combi boiler?',
    answer:
      'On a combi, the kW figure is mostly about hot water. It is how much heat the boiler can put into the water flowing through it while a tap or shower runs. A 24 kW combi runs one shower well; 30 to 32 kW copes with a bath and a separate shower; 36 kW is for large homes. Heating the radiators needs far less than that, so kW is not a measure of how warm the house gets.',
  },
  {
    question: 'What size combi boiler does a 3 bedroom house need?',
    answer:
      'For a typical 3 bedroom home we fit a 30 to 32 kW combi. With one bathroom and no separate shower a 30 kW is the usual choice; add a separate shower or a second bathroom and we size for higher hot water demand, still in the 30 to 32 kW band.',
  },
  {
    question: 'When is a system boiler better than a combi?',
    answer:
      'When several people want hot water at once. A system boiler heats a cylinder, so two showers can run together without the flow dropping. It is usually the better answer for homes with 5 or more bedrooms, homes with two bathrooms in constant use, and homes that already have a cylinder. A survey confirms which is right.',
  },
];

export default function BoilerKwCalculatorPage() {
  return (
    <>
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Help & advice', path: '/help-and-advice' },
            { name: 'Boiler kW calculator', path: '/collection/boiler-kw-calculator' },
          ])
        )}
      />
      <script {...jsonLdScriptProps(faqPageSchema(faqs))} />

      <article>
        <Container size="md" py={{ base: 40, md: 80 }}>
          <Anchor href="/help-and-advice" size="sm" mb="lg" display="inline-block">
            ← Help &amp; advice
          </Anchor>

          <Stack gap="xs" mb="xl">
            <Title order={1}>Boiler kW calculator</Title>
            <Text c="dimmed" size="lg">
              Answer five quick questions and see the combi size band we would fit in your home, and
              whether a system boiler would suit you better. Same rules as our instant quote.
            </Text>
          </Stack>

          <KwCalculator />

          <Stack gap="md" mt={48}>
            <Title order={2} size="h3">
              What kW means for a combi
            </Title>
            <Text>
              On a combi boiler the kW figure is really about hot water. It is how much heat the
              boiler can put into the water passing through it while a tap or shower is running, so
              a bigger number means a stronger, steadier flow. A 24 kW combi runs one shower well.
              30 to 32 kW copes with a bath plus a separate shower, or two bathrooms, without the
              second one turning lukewarm. 36 kW is for large homes. Heating the radiators needs far
              less than any of these, which is why bedrooms and bathrooms, not floor area, drive the
              size.
            </Text>

            <Title order={2} size="h3">
              When a system boiler is the better answer
            </Title>
            <Text>
              A combi heats water as you use it, so it can only serve so many outlets at once. A
              system boiler heats a cylinder instead, and a full cylinder will run two showers
              together without either one dropping. We would point you towards a system boiler when
              your home has five or more bedrooms, when two bathrooms are in use at the same time
              most mornings, or when you already have a cylinder and a like-for-like swap is the
              simplest job. If you have a system or standard boiler now and want a combi, that is
              possible too. The cylinder comes out and the pipework changes, and the quote prices
              that as its own line.
            </Text>

            <Title order={2} size="h3">
              How we size it
            </Title>
            <List spacing="xs">
              <ListItem>Bedrooms set the heating size. More rooms, more radiators.</ListItem>
              <ListItem>
                Two baths, two separate showers, or a bath plus a separate shower means high hot
                water demand, and we only offer boilers rated for it.
              </ListItem>
              <ListItem>
                Property type and your current boiler are carried into your quote, so you only
                answer once.
              </ListItem>
              <ListItem>
                The result is indicative. The free survey checks radiators, mains water flow and the
                flue before we confirm the size and lock in your price.
              </ListItem>
            </List>
            <Text size="sm" c="dimmed">
              Rather talk it through? Call {business.phoneDisplay} and ask for Richard.
            </Text>
          </Stack>
        </Container>
      </article>

      <QuoteCta />
    </>
  );
}
