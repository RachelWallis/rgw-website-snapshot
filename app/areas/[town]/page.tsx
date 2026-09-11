import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Anchor,
  Container,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { EmergencyStrip } from '@/components/EmergencyStrip/EmergencyStrip';
import { PhotoBand } from '@/components/PhotoBand/PhotoBand';
import { QuoteCta } from '@/components/QuoteCta/QuoteCta';
import { getTownPage, townPages } from '@/content/town-pages';
import { business } from '@/lib/business';
import { breadcrumbSchema, faqPageSchema, jsonLdScriptProps, serviceSchema } from '@/lib/schema';

type Params = { town: string };

export function generateStaticParams(): Params[] {
  return townPages.map((t) => ({ town: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { town } = await params;
  const page = getTownPage(town);
  if (!page) {
    return { title: 'Not found' };
  }
  return { title: page.title, description: page.metaDescription };
}

export default async function TownPage({ params }: { params: Promise<Params> }) {
  const { town } = await params;
  const page = getTownPage(town);
  if (!page) {
    notFound();
  }

  return (
    <>
      <script {...jsonLdScriptProps(faqPageSchema(page.faqs))} />
      <script
        {...jsonLdScriptProps(
          serviceSchema({
            name: `Heating & plumbing in ${page.name}`,
            description: page.metaDescription,
            url: `${business.url}/areas/${page.slug}`,
            areaName: page.name,
          })
        )}
      />
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Areas we cover', path: '/areas-we-cover' },
            { name: page.name, path: `/areas/${page.slug}` },
          ])
        )}
      />

      <PhotoBand src="/images/bg/hero-utility-room.jpg" title={page.h1} />

      <section>
        <Container size="lg" py={{ base: 40, md: 60 }}>
          <Stack gap="lg" maw={760}>
            <Text size="lg">{page.intro}</Text>

            {page.sections.map((section) => (
              <div key={section.heading}>
                <Title order={2} size="h3" mb="sm">
                  {section.heading}
                </Title>
                <Stack gap="md">
                  {section.paragraphs.map((paragraph) => (
                    <Text key={paragraph.slice(0, 40)} c="dimmed">
                      {paragraph}
                    </Text>
                  ))}
                </Stack>
              </div>
            ))}

            <div>
              <Title order={2} size="h3" mb="sm">
                What it costs
              </Title>
              <Text c="dimmed">{page.costs}</Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                Common questions
              </Title>
              <Accordion variant="separated" radius="lg">
                {page.faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionControl>
                      <Text fw={600}>{faq.question}</Text>
                    </AccordionControl>
                    <AccordionPanel>
                      <Text c="dimmed">{faq.answer}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <Text c="dimmed" size="sm">
              Postcodes covered: {page.postcodes} and surrounding areas,{' '}
              <Anchor href="/areas-we-cover">see everywhere we work</Anchor>.
            </Text>
          </Stack>
        </Container>
      </section>

      <EmergencyStrip />

      <QuoteCta />
    </>
  );
}
