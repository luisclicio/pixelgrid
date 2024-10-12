'use client';

import { type Session } from 'next-auth';
import {
  AppShell,
  Box,
  Burger,
  Group,
  Menu,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconFolder,
  IconHeart,
  IconLogout,
  IconPhoto,
  IconShare,
  IconTrash,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import cx from 'clsx';

import { handleSignOut } from '@/actions/auth';
import { LogoIcon, LogoWithText } from '@/components/Logo';
import { UserProfileMenu } from '@/components/Menus/UserProfileMenu';
import { NavbarItem, type NavbarItemData } from '@/components/NavbarItem';
import { ChangeThemeMenu } from '@/components/Menus/ChangeThemeMenu';

import classes from './styles.module.css';

const NAVBAR_ITEMS: NavbarItemData[] = [
  {
    label: 'Imagens',
    icon: <IconPhoto />,
    href: '/dashboard',
  },
  {
    label: 'Álbuns',
    icon: <IconFolder />,
    href: '/dashboard/albums',
  },
  {
    label: 'Favoritos',
    icon: <IconHeart />,
    href: '/dashboard/favorites',
  },
  {
    label: 'Compartilhados',
    icon: <IconShare />,
    href: '/dashboard/shared',
  },
  {
    label: 'Lixeira',
    icon: <IconTrash />,
    href: '/dashboard/trash',
  },
];

export function DashboardLayout({
  session,
  children,
}: Readonly<{
  session: Session | null;
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [navbarOpened, navbarHandler] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 270,
        breakpoint: 'md',
        collapsed: {
          mobile: !navbarOpened,
        },
      }}
      padding="md"
    >
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

          <Group>
            <UserProfileMenu user={{ name: session?.user?.name ?? '' }}>
              <Box py={4}>
                <Text px="xs" fw="bold">
                  {session?.user?.name}
                </Text>

                <Text px="xs" fz="sm" c="dimmed">
                  {session?.user?.email}
                </Text>
              </Box>

              <Menu.Divider />

              <form action={handleSignOut}>
                <Menu.Item
                  component="button"
                  type="submit"
                  color="red"
                  leftSection={<IconLogout size={18} />}
                >
                  Sair
                </Menu.Item>
              </form>
            </UserProfileMenu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section component={ScrollArea} grow>
          <Stack gap="xs">
            {NAVBAR_ITEMS.map((item) => (
              <NavbarItem key={item.label} item={item} pathname={pathname} />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <ChangeThemeMenu />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main className={cx(classes.main)}>{children}</AppShell.Main>
    </AppShell>
  );
}
