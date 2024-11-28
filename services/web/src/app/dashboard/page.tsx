import { Group, MultiSelect, Stack } from '@mantine/core';
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

      <ImageCardGrid>
        {userImages.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </ImageCardGrid>
    </Stack>
  );
}
