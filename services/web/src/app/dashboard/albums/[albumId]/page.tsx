import { Badge, Group, MultiSelect, Stack, Text, Title } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

import { getAlbum } from '@/actions/albums';
import { listUserImages } from '@/actions/images';
import { listAvailableUserTags } from '@/actions/tags';
import { ImageCard, ImageCardGrid } from '@/components/Cards/ImageCard';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';
import { BackButton } from '@/components/Buttons/BackButton';

export default async function DashboardAlbum({
  params,
}: {
  params: { albumId: string };
}) {
  const album = await getAlbum(params.albumId);
  const userImages = await listUserImages({ albumId: params.albumId });
  const userTags = await listAvailableUserTags();

  return (
    <Stack>
      <Group>
        <BackButton />

        <Group gap="xs">
          <Title>{album?.title}</Title>
          <Badge>
            {album?.accessGrantType === 'PRIVATE' ? 'Privado' : 'Público'}
          </Badge>
        </Group>
      </Group>

      <Group justify="space-between">
        <MultiSelect
          placeholder="Filtre as imagens pelo que há nelas..."
          data={userTags.map((tag) => ({
            value: tag.key,
            label: tag.label ?? tag.key,
          }))}
          clearable
          searchable
          leftSection={<IconSearch size={20} />}
          maw={800}
          style={{ flex: 1 }}
        />

        <RefreshPageButton />
      </Group>

      {userImages.length > 0 ? (
        <ImageCardGrid>
          {userImages.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </ImageCardGrid>
      ) : (
        <Text c="dimmed">Nenhuma imagem encontrada.</Text>
      )}
    </Stack>
  );
}
