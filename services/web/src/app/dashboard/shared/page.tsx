import { Stack, Group, Autocomplete, Title, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

import { listUserAlbums } from '@/actions/albums';
import { listUserImages } from '@/actions/images';
import { listAvailableUserTags } from '@/actions/tags';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';
import { AlbumCardGrid, AlbumCard } from '@/components/Cards/AlbumCard';
import { ImageCardGrid, ImageCard } from '@/components/Cards/ImageCard';

export default async function DashboardShared() {
  const userAlbums = await listUserAlbums({ onlyPublic: true });
  const userImages = await listUserImages({ onlyPublic: true });
  const userTags = await listAvailableUserTags();

  return (
    <Stack>
      <Group justify="space-between">
        <Autocomplete
          placeholder="Buscar álbuns ou tags..."
          data={[
            {
              group: 'Álbuns',
              items: Array.from(
                new Set(userAlbums.map((album) => album.title))
              ),
            },
            {
              group: 'Tags',
              items: Array.from(
                new Set(userTags.map((tag) => tag.label ?? tag.key))
              ),
            },
          ]}
          leftSection={<IconSearch size={20} />}
          maw={800}
          style={{ flex: 1 }}
        />

        <RefreshPageButton />
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
          <Text c="dimmed">Nenhum álbum compartilhado.</Text>
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
          <Text c="dimmed">Nenhuma imagem compartilhada.</Text>
        )}
      </Stack>
    </Stack>
  );
}
