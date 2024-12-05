'use client';

import {
  IconDownload,
  IconHeart,
  IconHeartFilled,
  IconInfoCircle,
  IconRestore,
  IconShare,
  IconTrash,
} from '@tabler/icons-react';
import {
  Card,
  Image as MantineImage,
  Text,
  Group,
  Badge,
  ActionIcon,
  CardSection,
  Box,
  Divider,
  SimpleGrid,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { useRouter } from 'next/navigation';

import type { Image } from '@/types';
import { deleteImages, restoreImagesFromTrash } from '@/actions/images';

export type ImageCardProps = {
  image: Image;
};

export function ImageCard({ image }: ImageCardProps) {
  const router = useRouter();

  function handleDeleteAction() {
    modals.openConfirmModal({
      size: 'md',
      title: image.movedToTrash
        ? 'Excluir imagem permanentemente'
        : 'Mover imagem para a lixeira',
      centered: true,
      children: (
        <Text>
          {image.movedToTrash
            ? 'Tem certeza que deseja excluir permanentemente esta imagem?'
            : 'Tem certeza que deseja mover esta imagem para a lixeira?'}
        </Text>
      ),
      labels: {
        confirm: image.movedToTrash
          ? 'Excluir permanentemente'
          : 'Mover para a lixeira',
        cancel: 'Cancelar',
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteImages([image.id], {
            onlyMoveToTrash: !image.movedToTrash,
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
      title: 'Restaurar imagem',
      centered: true,
      children: (
        <Text>
          Tem certeza que deseja restaurar esta imagem da lixeira? Ela voltará
          para a lista de imagens.
        </Text>
      ),
      labels: {
        confirm: 'Restaurar',
        cancel: 'Cancelar',
      },
      onConfirm: async () => {
        try {
          await restoreImagesFromTrash([image.id]);
          router.refresh();
        } catch (error) {
          console.error(error);
        }
      },
    });
  }

  return (
    <Card pb="sm">
      <CardSection>
        <MantineImage
          src={image.url}
          alt={image.metadata?.name ?? ''}
          height={220}
        />
      </CardSection>

      <Box mt="sm">
        <Group justify="space-between" gap="xs">
          <Text fz="lg" fw="bold" truncate="end" style={{ flex: 1 }}>
            {image.metadata?.name ?? 'Sem título'}
          </Text>

          <Badge>
            {image.accessGrantType === 'PRIVATE' ? 'Privado' : 'Público'}
          </Badge>
        </Group>

        {image?.description && <Text fz="sm">{image?.description}</Text>}
      </Box>

      <CardSection py="sm">
        <Divider />
      </CardSection>

      <Box>
        <Text inline c="dimmed" tt="uppercase" fw="bold" fz="xs">
          Tags
        </Text>

        {image.tags.length > 0 ? (
          <Group gap={8} mt={6}>
            {image.tags.map((tag) => (
              <Badge key={tag.id}>{tag.label ?? tag.key}</Badge>
            ))}
          </Group>
        ) : (
          <Text c="dimmed" fz="sm" mt={6}>
            Não categorizado
          </Text>
        )}
      </Box>

      <CardSection py="sm" mt="auto">
        <Divider />
      </CardSection>

      <Group justify="space-between">
        <Tooltip
          label={
            image.movedToTrash
              ? 'Excluir permanentemente'
              : 'Mover para a lixeira'
          }
        >
          <ActionIcon variant="subtle" onClick={handleDeleteAction}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>

        {image.movedToTrash && (
          <Tooltip label="Restaurar">
            <ActionIcon variant="subtle" onClick={handleRestoreAction}>
              <IconRestore />
            </ActionIcon>
          </Tooltip>
        )}

        <Tooltip label="Compartilhar">
          <ActionIcon variant="subtle">
            <IconShare />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Ver detalhes">
          <ActionIcon variant="subtle">
            <IconInfoCircle />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Baixar">
          <ActionIcon variant="subtle">
            <IconDownload />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Favoritar">
          <ActionIcon variant="subtle" c={image.favorite ? 'red' : undefined}>
            {image.favorite ? <IconHeartFilled /> : <IconHeart />}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );
}

export function ImageCardGrid({ children }: { children: React.ReactNode }) {
  return <SimpleGrid cols={{ xs: 2, md: 3, xl: 4 }}>{children}</SimpleGrid>;
}
