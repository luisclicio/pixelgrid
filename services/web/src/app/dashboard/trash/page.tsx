import { Stack, Group, Autocomplete, Title, Text, Button } from '@mantine/core';
import { IconSearch, IconTrashX } from '@tabler/icons-react';

import { listUserAlbums } from '@/actions/albums';
import { listUserImages } from '@/actions/images';
import { listAvailableUserTags } from '@/actions/tags';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';
import { AlbumCardGrid, AlbumCard } from '@/components/Cards/AlbumCard';
import { ImageCardGrid, ImageCard } from '@/components/Cards/ImageCard';

export default async function DashboardTrash() {
  const userAlbums = await listUserAlbums({ trashFilter: 'ONLY_TRASHED' });
  const userImages = await listUserImages({ trashFilter: 'ONLY_TRASHED' });
  const userTags = await listAvailableUserTags();

  return (
    <Stack>
      <Group justify="space-between">
        <Autocomplete
          placeholder="Buscar álbuns ou tags..."
          data={[
            {
              group: 'Álbuns',
              items: userAlbums.map((album) => album.title),
            },
            {
              group: 'Tags',
              items: userTags.map((tag) => tag.label ?? tag.key),
            },
          ]}
          leftSection={<IconSearch size={20} />}
          maw={800}
          style={{ flex: 1 }}
        />

        <Group>
          <RefreshPageButton />

          <Button
            color="red"
            leftSection={<IconTrashX />}
            disabled={userAlbums.length === 0 && userImages.length === 0}
          >
            Esvaziar lixeira
          </Button>
        </Group>
      </Group>

      <Stack gap="xs">
        <Title order={2}>Álbuns</Title>

        {userAlbums.length > 0 ? (
          <AlbumCardGrid>
            {userAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} withRestoreButton />
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
              <ImageCard key={image.id} image={image} withRestoreButton />
            ))}
          </ImageCardGrid>
        ) : (
          <Text c="dimmed">Nenhuma imagem encontrada.</Text>
        )}
      </Stack>
    </Stack>
  );
}
