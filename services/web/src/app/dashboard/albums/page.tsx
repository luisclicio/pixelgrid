import { Autocomplete, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconFolderPlus, IconSearch } from '@tabler/icons-react';

import { listUserAlbums } from '@/actions/albums';
import { listAvailableUserTags } from '@/actions/tags';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';
import { AlbumCard, AlbumCardGrid } from '@/components/Cards/AlbumCard';
import { TagCard, TagCardGrid } from '@/components/Cards/TagCard';

export default async function DashboardAlbums() {
  const userAlbums = await listUserAlbums();
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

          <Button leftSection={<IconFolderPlus />}>Novo álbum</Button>
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
        <Title order={2}>Tags</Title>

        {userTags.length > 0 ? (
          <TagCardGrid>
            {userTags.map((tag) => (
              <TagCard key={tag.id} tag={tag} />
            ))}
          </TagCardGrid>
        ) : (
          <Text c="dimmed">Nenhuma tag encontrada.</Text>
        )}
      </Stack>
    </Stack>
  );
}
