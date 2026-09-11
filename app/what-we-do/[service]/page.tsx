import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IconCircleCheck, IconPhone } from '@tabler/icons-react';
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Anchor,
  Button,
  Card,
  Container,
  Group,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { PhotoBand } from '@/components/PhotoBand/PhotoBand';
import { QuoteCta } from '@/components/QuoteCta/QuoteCta';
import { TrustStrip } from '@/components/TrustStrip/TrustStrip';
import { business } from '@/lib/business';
import { enquiryHref } from '@/lib/enquiries';
import { pageOpenGraph } from '@/lib/og';
import { breadcrumbSchema, faqPageSchema, jsonLdScriptProps, serviceSchema } from '@/lib/schema';
import { getService, services } from '@/lib/services';

type Params = { service: string };

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ service: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { service } = await params;
  const content = getService(service);
  if (!content) {
    return { title: 'Not found' };
  }
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    openGraph: pageOpenGraph('default', {
      title: content.metaTitle,
      description: content.metaDescription,
    }),
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { service } = await params;
  const content = getService(service);
  if (!content) {
    notFound();
  }

  const allFaqs = content.jobs.flatMap((job) => job.faqs);
  const serviceUrl = `${business.url}/what-we-do/${service}`;

  return (
    <>
      <script
        {...jsonLdScriptProps(
          serviceSchema({
            name: content.name,
            description: content.metaDescription,
            url: serviceUrl,
          })
        )}
      />
      <script {...jsonLdScriptProps(faqPageSchema(allFaqs))} />
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'What we do', path: '/what-we-do' },
            { name: content.name, path: `/what-we-do/${service}` },
          ])
        )}
      />

      {content.heroImage && <PhotoBand src={content.heroImage} title={content.heroTitle} />}

      <section>
        <Container size="lg" py={{ base: 50, md: 80 }}>
          <Stack gap="md" maw={760}>
            {!content.heroImage && <Title order={1}>{content.heroTitle}</Title>}
            <Title order={2}>{content.tagline}</Title>
            <Text size="xl" c="dimmed">
              {content.intro}
            </Text>
            <Group mt="sm">
              {content.cta === 'quote' ? (
                <Button component="a" href="/get-a-quote" size="lg" color="rgwOrange">
                  Get my instant quote
                </Button>
              ) : (
                <Button
                  component="a"
                  href={`tel:${business.phoneE164}`}
                  size="lg"
                  color="rgwOrange"
                  leftSection={<IconPhone size={20} />}
                >
                  Call {business.phoneDisplay}
                </Button>
              )}
              <Button
                component="a"
                href={content.cta === 'quote' ? `tel:${business.phoneE164}` : '/get-a-quote'}
                size="lg"
                variant="light"
                color="rgwBlue"
              >
                {content.cta === 'quote' ? `Call ${business.phoneDisplay}` : 'Get a quote online'}
              </Button>
              {content.enquiryCta && (
                <Button
                  component="a"
                  href={enquiryHref(content.enquiryCta.enquiry)}
                  size="lg"
                  variant="outline"
                  color="rgwBlue"
                >
                  {content.enquiryCta.label}
                </Button>
              )}
            </Group>
          </Stack>
        </Container>
      </section>

      <TrustStrip />

      <section>
        <Container size="lg" py={{ base: 40, md: 70 }}>
          <Stack gap="xl">
            <Stack gap="xs" maw={640}>
              <Title order={2} size="h3">
                What we can do for you
              </Title>
              <Text c="dimmed">
                The different jobs we take on under {content.heroTitle.toLowerCase()}, with straight
                answers to the questions we get asked most.
              </Text>
            </Stack>

            {content.jobs.map((job) => (
              <Card key={job.title} withBorder radius="lg" shadow="sm" p={{ base: 'lg', md: 'xl' }}>
                <Stack gap="md">
                  <Title order={3} c="rgwBlue">
                    {job.title}
                  </Title>
                  <Text size="lg">{job.blurb}</Text>
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'lg', md: 40 }} mt="xs">
                    <List
                      spacing="sm"
                      icon={
                        <ThemeIcon size={24} radius="xl" color="rgwOrange" variant="light">
                          <IconCircleCheck size={16} />
                        </ThemeIcon>
                      }
                    >
                      {job.points.map((point) => (
                        <ListItem key={point}>{point}</ListItem>
                      ))}
                    </List>

                    {job.faqs.length > 0 && (
                      <Accordion variant="separated" radius="md">
                        {job.faqs.map((faq) => (
                          <AccordionItem key={faq.question} value={faq.question}>
                            <AccordionControl>
                              <Text fw={600} size="sm">
                                {faq.question}
                              </Text>
                            </AccordionControl>
                            <AccordionPanel>
                              <Text c="dimmed" size="sm">
                                {faq.answer}
                              </Text>
                            </AccordionPanel>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </SimpleGrid>
                </Stack>
              </Card>
            ))}

            <Text c="dimmed" size="sm">
              Covering Eastleigh, Winchester, Southampton and the surrounding South Hampshire area,{' '}
              <Anchor href="/areas-we-cover">see everywhere we work</Anchor>.
            </Text>
          </Stack>
        </Container>
      </section>

      <QuoteCta />
    </>
  );
}
