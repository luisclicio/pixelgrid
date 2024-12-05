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
import { useRouter } from 'next/navigation';
import { modals } from '@mantine/modals';

import type { Album } from '@/types';
import { deleteAlbums, restoreAlbumsFromTrash } from '@/actions/albums';

export type AlbumCardProps = {
  album: Album;
};

export function AlbumCard({ album }: AlbumCardProps) {
  const router = useRouter();

  function handleOpenAction() {
    router.push(`/dashboard/albums/${album.id}`);
  }

  function handleDeleteAction() {
    modals.openConfirmModal({
      size: 'md',
      title: album.movedToTrash
        ? 'Excluir álbum permanentemente'
        : 'Mover álbum para a lixeira',
      centered: true,
      children: (
        <Text>
          {album.movedToTrash
            ? 'Tem certeza que deseja excluir permanentemente este álbum? As imagens dentro dele também serão excluídas.'
            : 'Tem certeza que deseja mover este álbum para a lixeira?'}
        </Text>
      ),
      labels: {
        confirm: album.movedToTrash
          ? 'Excluir permanentemente'
          : 'Mover para a lixeira',
        cancel: 'Cancelar',
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteAlbums([album.id], {
            onlyMoveToTrash: !album.movedToTrash,
          });
          router.refresh();
        } catch (error) {
          console.error(error);
        }
      },
    });
  }

  function handleRestoreAction() {
    modals.openConfirmModal({
      size: 'md',
      title: 'Restaurar álbum',
      centered: true,
      children: (
        <Text>
          Tem certeza que deseja restaurar este álbum da lixeira? Ela voltará
          para a lista de álbuns.
        </Text>
      ),
      labels: {
        confirm: 'Restaurar',
        cancel: 'Cancelar',
      },
      onConfirm: async () => {
        try {
          await restoreAlbumsFromTrash([album.id]);
          router.refresh();
        } catch (error) {
          console.error(error);
        }
      },
    });
  }

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
          <Menu.Item
            leftSection={<IconFolderOpen size={18} />}
            onClick={handleOpenAction}
          >
            Abrir
          </Menu.Item>

          <Menu.Item leftSection={<IconCursorText size={18} />}>
            Renomear
          </Menu.Item>

          <Menu.Item leftSection={<IconShare size={18} />}>
            Compartilhar
          </Menu.Item>

          {album.movedToTrash && (
            <Menu.Item
              leftSection={<IconRestore size={18} />}
              onClick={handleRestoreAction}
            >
              Restaurar
            </Menu.Item>
          )}

          <Menu.Item
            color="red"
            leftSection={<IconTrash size={18} />}
            onClick={handleDeleteAction}
          >
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
