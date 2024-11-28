'use client';

import {
  ActionIcon,
  Box,
  Card,
  Group,
  Menu,
  SimpleGrid,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCursorText,
  IconDots,
  IconFolder,
  IconFolderOpen,
  IconRestore,
  IconShare,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';

import type { Album } from '@/types';

export type AlbumCardProps = {
  album: Album;
  withRestoreButton?: boolean;
};

export function AlbumCard({
  album,
  withRestoreButton = false,
}: AlbumCardProps) {
  return (
    <Box pos="relative">
      <Card component={Link} href={`/dashboard/albums/${album.id}`} p="sm">
        <Group wrap="wrap" gap="xs" mr={12 + 32}>
          <ThemeIcon variant="light" size="lg">
            <IconFolder />
          </ThemeIcon>

          <Text truncate="end" style={{ flex: 1 }}>
            {album.title}
          </Text>
        </Group>
      </Card>

      <Menu>
        <Menu.Target>
          <ActionIcon
            aria-label={`Opções do álbum ${album.title}`}
            pos="absolute"
            top={12}
            right={12}
          >
            <IconDots />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<IconFolderOpen size={18} />}>
            Abrir
          </Menu.Item>

          <Menu.Item leftSection={<IconCursorText size={18} />}>
            Renomear
          </Menu.Item>

          <Menu.Item leftSection={<IconShare size={18} />}>
            Compartilhar
          </Menu.Item>

          {withRestoreButton && (
            <Menu.Item leftSection={<IconRestore size={18} />}>
              Restaurar
            </Menu.Item>
          )}

          <Menu.Item color="red" leftSection={<IconTrash size={18} />}>
            Excluir
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}

export function AlbumCardGrid({ children }: { children: React.ReactNode }) {
  return <SimpleGrid cols={{ xs: 2, md: 3, xl: 4 }}>{children}</SimpleGrid>;
}
