'use client';

import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import cx from 'clsx';

import { LogoIcon, LogoWithText } from '@/components/Logo';

import classes from './styles.module.css';

export function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navbarOpened, navbarHandler] = useDisclosure(false);

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Group justify="space-between" px="md" h="100%">
          <Group>
            <Burger
              opened={navbarOpened}
              onClick={navbarHandler.toggle}
              hiddenFrom="md"
              size="sm"
            />

            <LogoWithText visibleFrom="md" />
            <LogoIcon hiddenFrom="md" h={36} />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main className={cx(classes.main)}>{children}</AppShell.Main>
    </AppShell>
  );
}
