import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconFolderPlus } from '@tabler/icons-react';

import { listUserAlbums } from '@/actions/albums';
import { listAvailableUserTags } from '@/actions/tags';
import { SearchFilterInput } from '@/components/Inputs/SearchFilterInput';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';
import { openCreateAlbumModal } from '@/components/Modals/CreateAlbumModal';
import { AlbumCard, AlbumCardGrid } from '@/components/Cards/AlbumCard';
import { TagCard, TagCardGrid } from '@/components/Cards/TagCard';

export default async function DashboardAlbums(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const userAlbums = await listUserAlbums({
    searchQuery: searchParams.search,
  });
  const userTags = await listAvailableUserTags({
    searchQuery: searchParams.search,
  });

  return (
    <Stack>
      <Group justify="space-between">
        <SearchFilterInput
          placeholder="Busque por álbuns ou tags..."
          albums={userAlbums}
          tags={userTags}
        />

        <Group>
          <RefreshPageButton />

          <Button
            leftSection={<IconFolderPlus />}
            onClick={openCreateAlbumModal}
          >
            Novo álbum
          </Button>
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
