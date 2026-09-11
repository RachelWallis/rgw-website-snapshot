'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconPhone } from '@tabler/icons-react';
import { Burger, Button, Divider, Drawer, Group, ScrollArea } from '@mantine/core';
import { business } from '@/lib/business';
import { navLinks } from './navLinks';
import classes from './Hero.module.css';

/** Burger + drawer nav for the homepage hero on mobile, where the nav pill is hidden and the sitewide header doesn't render. */
export function HeroMobileNav() {
  const [opened, setOpened] = useState(false);
  const close = () => setOpened(false);

  return (
    <>
      <Burger
        opened={opened}
        onClick={() => setOpened((o) => !o)}
        color="white"
        className={classes.burger}
        aria-label="Open menu"
      />
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title="Navigation"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />

          <Link href="/" className={classes.drawerLink} onClick={close}>
            Home
          </Link>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={classes.drawerLink} onClick={close}>
              {link.label}
            </Link>
          ))}

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
            <Button component={Link} href="/get-a-quote" color="rgwOrange" onClick={close}>
              Get a Quote
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </>
  );
}
