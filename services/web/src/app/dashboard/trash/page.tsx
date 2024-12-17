import { Stack, Group, Title, Text } from '@mantine/core';

import { listUserAlbums } from '@/actions/albums';
import { listUserImages } from '@/actions/images';
import { listAvailableUserTags } from '@/actions/tags';
import { TagsFilterSelect } from '@/components/Selects/TagsFilterSelect';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';
import { EmptyTrashButton } from '@/components/Buttons/EmptyTrashButton';
import { AlbumCardGrid, AlbumCard } from '@/components/Cards/AlbumCard';
import { ImageCardGrid, ImageCard } from '@/components/Cards/ImageCard';

export default async function DashboardTrash(props: {
  searchParams?: Promise<{ tags?: string }>;
}) {
  const searchParams = await props.searchParams;
  const userAlbums = await listUserAlbums({ trashFilter: 'ONLY_TRASHED' });
  const userImages = await listUserImages({
    trashFilter: 'ONLY_TRASHED',
    tagsKeys: searchParams?.tags?.split(';;').filter(Boolean),
  });
  const userTags = await listAvailableUserTags();

  return (
    <Stack>
      <Group justify="space-between">
        <TagsFilterSelect tags={userTags} />

        <Group>
          <RefreshPageButton />

          <EmptyTrashButton
            disabled={userAlbums.length === 0 && userImages.length === 0}
          />
        </Group>
      </Group>

      <Stack gap="xs">
        <Title order={2}>Álbuns</Title>

        {userAlbums.length > 0 ? (
          <AlbumCardGrid>
            {userAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </AlbumCardGrid>
        ) : (
          <Text c="dimmed">Nenhum álbum encontrado.</Text>
        )}
      </Stack>

      <Stack gap="xs" mt="xs">
        <Title order={2}>Imagens</Title>

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
    </Stack>
  );
}
