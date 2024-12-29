'use client';

import {
  IconDownload,
  IconHeart,
  IconHeartFilled,
  IconInfoCircle,
  IconRestore,
  IconShare,
  IconTrash,
  IconX,
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
  Stack,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import type { Image } from '@/types';
import { deleteImages, restoreImagesFromTrash } from '@/actions/images';
import { toggleFavoriteImage } from '@/actions/favorites';
import { downloadFile } from '@/libs/browser';
import { openShareResourceModal } from '@/components/Modals/ShareResourceModal';

export type ImageCardProps = {
  image: Image;
};

export function ImageCard({ image }: ImageCardProps) {
  const router = useRouter();
  const session = useSession();
  const [userIsOwner, setUserIsOwner] = useState(false);

  useEffect(() => {
    setUserIsOwner(Number(session?.data?.user?.id) === image.ownerId);
  }, [session, image.ownerId]);

  async function handleFavoriteAction() {
    const result = await toggleFavoriteImage(image.id);

    if (result.status === 'SUCCESS') {
      router.refresh();
    }
  }

  async function handleDownloadAction() {
    if (!image.url) {
      return;
    }

    try {
      await downloadFile(image.url, image.metadata?.name);
    } catch (error) {
      console.error(error);

      notifications.show({
        title: 'Erro ao baixar imagem',
        message: 'Ocorreu um erro ao baixar a imagem. Tente novamente.',
        color: 'red',
        icon: <IconX />,
      });
    }
  }

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

  function handleShareAction() {
    openShareResourceModal({
      resource: {
        type: 'image',
        id: image.id,
        name: image.metadata?.name,
        accessGrantType: image.accessGrantType,
      },
    });
  }

  function handleViewDetailsAction() {
    modals.open({
      title: 'Detalhes da imagem',
      children: (
        <Stack gap="sm">
          <MantineImage
            src={image.url}
            alt={image.metadata?.name ?? ''}
            mah={580}
            fit="contain"
            mx="auto"
            radius="md"
          />

          <Group justify="space-between" gap="xs">
            <Text fz="lg" fw="bold" style={{ flex: 1 }}>
              {image.metadata?.name ?? 'Sem título'}
            </Text>

            <Badge>
              {image.accessGrantType === 'PRIVATE' ? 'Privado' : 'Público'}
            </Badge>
          </Group>

          <Divider />

          <Stack gap={0}>
            <Text fz="sm" fw="bold">
              Tamanho:
            </Text>
            <Text>
              {new Intl.NumberFormat('en', {
                notation: 'compact',
                style: 'unit',
                unit: 'byte',
                unitDisplay: 'narrow',
              }).format(image.metadata?.size ?? 0)}
            </Text>
          </Stack>

          <Stack gap={0}>
            <Text fz="sm" fw="bold">
              Criada em:
            </Text>
            <Text>
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: 'medium',
                timeStyle: 'medium',
              }).format(new Date(image.createdAt))}
            </Text>
          </Stack>

          <Stack gap={0}>
            <Text fz="sm" fw="bold">
              Atualizada em:
            </Text>
            <Text>
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: 'medium',
                timeStyle: 'medium',
              }).format(new Date(image.updatedAt))}
            </Text>
          </Stack>

          {image.tags.length > 0 && (
            <Stack gap={4}>
              <Text fz="sm" fw="bold">
                Tags:
              </Text>
              <Group gap={8}>
                {image.tags.map((tag) => (
                  <Badge key={tag.id}>{tag.label ?? tag.key}</Badge>
                ))}
              </Group>
            </Stack>
          )}
        </Stack>
      ),
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
        {userIsOwner && (
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
        )}

        {userIsOwner && image.movedToTrash && (
          <Tooltip label="Restaurar">
            <ActionIcon variant="subtle" onClick={handleRestoreAction}>
              <IconRestore />
            </ActionIcon>
          </Tooltip>
        )}

        {userIsOwner && (
          <Tooltip label="Compartilhar">
            <ActionIcon variant="subtle" onClick={handleShareAction}>
              <IconShare />
            </ActionIcon>
          </Tooltip>
        )}

        <Tooltip label="Ver detalhes">
          <ActionIcon variant="subtle" onClick={handleViewDetailsAction}>
            <IconInfoCircle />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Baixar">
          <ActionIcon variant="subtle" onClick={handleDownloadAction}>
            <IconDownload />
          </ActionIcon>
        </Tooltip>

        {userIsOwner && (
          <Tooltip label="Favoritar">
            <ActionIcon
              variant="subtle"
              c={image.favorite ? 'red' : undefined}
              onClick={handleFavoriteAction}
            >
              {image.favorite ? <IconHeartFilled /> : <IconHeart />}
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Card>
  );
}

export function ImageCardGrid({ children }: { children: React.ReactNode }) {
  return <SimpleGrid cols={{ sm: 2, lg: 3, xl: 4 }}>{children}</SimpleGrid>;
}
