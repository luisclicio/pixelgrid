import { Badge, Group, Stack, Text, Title } from '@mantine/core';

import { getAlbum } from '@/actions/albums';
import { listUserImages } from '@/actions/images';
import { listAvailableUserTags } from '@/actions/tags';
import { ImageCard, ImageCardGrid } from '@/components/Cards/ImageCard';
import { TagsFilterSelect } from '@/components/Selects/TagsFilterSelect';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';
import { BackButton } from '@/components/Buttons/BackButton';

export default async function DashboardAlbum(props: {
  params: { albumId: string };
  searchParams?: Promise<{ tags?: string }>;
}) {
  const searchParams = await props.searchParams;
  const album = await getAlbum(props.params.albumId);
  const userImages = await listUserImages({
    albumId: props.params.albumId,
    tagsKeys: searchParams?.tags?.split(';;').filter(Boolean),
  });
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
