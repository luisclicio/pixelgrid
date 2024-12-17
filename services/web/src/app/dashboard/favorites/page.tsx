import { Group, Stack, Text } from '@mantine/core';

import { listFavoritesUserImages } from '@/actions/favorites';
import { listAvailableUserTags } from '@/actions/tags';
import { ImageCard, ImageCardGrid } from '@/components/Cards/ImageCard';
import { TagsFilterSelect } from '@/components/Selects/TagsFilterSelect';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';

export default async function DashboardFavorites(props: {
  searchParams?: Promise<{ tags?: string }>;
}) {
  const searchParams = await props.searchParams;
  const userImages = await listFavoritesUserImages({
    tagsKeys: searchParams?.tags?.split(';;').filter(Boolean),
  });
  const userTags = await listAvailableUserTags();

  return (
    <Stack>
      <Group justify="space-between">
        <TagsFilterSelect tags={userTags} />

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
