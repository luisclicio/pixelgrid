import { Group, MultiSelect, Stack, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

import { listUserImages } from '@/actions/images';
import { listAvailableUserTags } from '@/actions/tags';
import { ImageCard, ImageCardGrid } from '@/components/Cards/ImageCard';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';

export default async function DashboardHome() {
  const userImages = await listUserImages();
  const userTags = await listAvailableUserTags();

  return (
    <Stack>
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
