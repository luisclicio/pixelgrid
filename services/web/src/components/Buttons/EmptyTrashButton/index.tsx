'use client';

import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrashX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import { deleteAllUserAlbumsOnTrash } from '@/actions/albums';
import { deleteAllUserImagesOnTrash } from '@/actions/images';

export function EmptyTrashButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();

  function handleClearTrash() {
    modals.openConfirmModal({
      size: 'md',
      title: 'Esvaziar lixeira',
      centered: true,
      children: (
        <Text>
          Tem certeza que deseja esvaziar a lixeira? Todos os álbuns e imagens
          nela serão removidos permanentemente.
        </Text>
      ),
      labels: {
        confirm: 'Esvaziar lixeira',
        cancel: 'Cancelar',
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteAllUserAlbumsOnTrash();
          await deleteAllUserImagesOnTrash();
          router.refresh();
        } catch (error) {
          console.error(error);
        }
      },
    });
  }

  return (
    <Button
      color="red"
      leftSection={<IconTrashX />}
      disabled={disabled}
      onClick={handleClearTrash}
    >
      Esvaziar lixeira
    </Button>
  );
}
