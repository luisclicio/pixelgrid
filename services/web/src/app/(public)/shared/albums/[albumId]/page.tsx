import { Badge, Group, Stack, Text, Title } from '@mantine/core';
import { notFound } from 'next/navigation';

import { getAlbum } from '@/actions/albums';
import { listImages } from '@/actions/images';
import { listAvailableAlbumTags } from '@/actions/tags';
import { ImageCard, ImageCardGrid } from '@/components/Cards/ImageCard';
import { TagsFilterSelect } from '@/components/Selects/TagsFilterSelect';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';

export default async function SharedAlbum(props: {
  params: { albumId: string };
  searchParams?: Promise<{ tags?: string }>;
}) {
  const searchParams = await props.searchParams;
  const album = await getAlbum(props.params.albumId);

  if (!album || album?.accessGrantType === 'PRIVATE') {
    return notFound();
  }

  const userImages = await listImages({
    albumId: props.params.albumId,
    tagsKeys: searchParams?.tags?.split(';;').filter(Boolean),
  });
  const userTags = await listAvailableAlbumTags({
    albumId: props.params.albumId,
  });

  return (
    <Stack>
      <Group>
        <Group gap="xs">
          <Title>{album?.title}</Title>
          <Badge>Público</Badge>
        </Group>
      </Group>

      <Group justify="space-between">
        <TagsFilterSelect tags={userTags} withReplace />

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
