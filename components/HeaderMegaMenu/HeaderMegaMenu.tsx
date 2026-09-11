'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  IconCertificate2,
  IconChevronDown,
  IconDeviceMobile,
  IconDropletCog,
  IconHeartCog,
  IconPhone,
  IconRipple,
  IconTool,
} from '@tabler/icons-react';
import {
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Flex,
  Group,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PillButton } from '@/components/PillButton/PillButton';
import { business } from '@/lib/business';
import classes from './HeaderMegaMenu.module.css';

const services = [
  {
    icon: IconDeviceMobile,
    title: 'Gas Central Heating',
    description: 'Full central heating installation and upgrades',
    href: '/what-we-do/gas-central-heating',
  },
  {
    icon: IconHeartCog,
    title: 'Boiler Services',
    description: 'We service and repair your boiler, always aiming for a repair when possible.',
    href: '/what-we-do/boiler-services',
  },
  {
    icon: IconCertificate2,
    title: 'Landlord Safety Certificates',
    description: 'Gas Safe certificates for rental properties',
    href: '/what-we-do/landlord-safety-certificates',
  },
  {
    icon: IconDropletCog,
    title: 'Radiator Installation',
    description: 'Change, add or move radiators',
    href: '/what-we-do/radiator-installation',
  },
  {
    icon: IconTool,
    title: 'General Plumbing',
    description: 'Everyday plumbing jobs, big and small',
    href: '/what-we-do/general-plumbing',
  },
  {
    icon: IconRipple,
    title: 'Powerflushing',
    description: 'Restore system efficiency and cure cold spots',
    href: '/what-we-do/powerflushing',
  },
];

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const serviceLinks = services.map((item) => (
    <UnstyledButton
      component={Link}
      href={item.href}
      className={classes.subLink}
      key={item.title}
      onClick={closeDrawer}
    >
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="lg">
          <item.icon size={22} color={theme.colors.rgwBlue[6]} />
        </ThemeIcon>
        <div>
          <Text size="md" fw={500}>
            {item.title}
          </Text>
          <Text size="sm" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" wrap="nowrap" p="md">
          <Flex justify="flex-start" align="center" className={classes.logoContainer}>
            <Link href="/" className={classes.logolinkContainer}>
              <Image
                className={classes.rgwLogo}
                src="/images/logo/logo.svg"
                alt="RGW Heating & Plumbing"
                width={379}
                height={35}
                preload
              />
            </Link>
          </Flex>

          <Group gap={4} wrap="nowrap" className={`${classes.navPill} ${classes.desktopNav}`}>
            <Link href="/what-we-do" className={classes.navLink}>
              What we do
            </Link>
            <Link href="/areas-we-cover" className={classes.navLink}>
              Areas we cover
            </Link>
            <Link href="/meet-the-team" className={classes.navLink}>
              Meet the team
            </Link>
            <Link href="/help-and-advice" className={classes.navLink}>
              Help &amp; advice
            </Link>
            <Link href="/contact-us" className={classes.navLink}>
              Contact us
            </Link>
          </Group>

          <Group gap="lg" wrap="nowrap" className={classes.desktopNav}>
            <Box component="a" href={`tel:${business.phoneE164}`} className={classes.phoneLink}>
              <IconPhone size={18} />
              {business.phoneDisplay}
            </Box>
            <PillButton href="/get-a-quote" variant="dark">
              Get a Quote
            </PillButton>
          </Group>

          <Box className={classes.mobileNav}>
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          </Box>
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />

          <Link href="/" className={classes.link} onClick={closeDrawer}>
            Home
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                What we do
              </Box>
              <IconChevronDown size={16} color={theme.colors.rgwBlue[6]} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{serviceLinks}</Collapse>
          <Link href="/areas-we-cover" className={classes.link} onClick={closeDrawer}>
            Areas we cover
          </Link>
          <Link href="/meet-the-team" className={classes.link} onClick={closeDrawer}>
            Meet the team
          </Link>
          <Link href="/help-and-advice" className={classes.link} onClick={closeDrawer}>
            Help &amp; advice
          </Link>
          <Link href="/contact-us" className={classes.link} onClick={closeDrawer}>
            Contact us
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button
              component="a"
              href={`tel:${business.phoneE164}`}
              variant="light"
              color="rgwBlue"
              leftSection={<IconPhone size={18} />}
            >
              Call us
            </Button>
            <Button component={Link} href="/get-a-quote" color="rgwOrange" onClick={closeDrawer}>
              Get a Quote
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
