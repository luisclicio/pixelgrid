import { Group, MultiSelect, SimpleGrid, Stack } from '@mantine/core';

import { listUserImages } from '@/actions/images';
import { ImageCard } from '@/components/Cards/ImageCard';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';

export default async function DashboardHome() {
  const userImages = await listUserImages();

  return (
    <Stack>
      <Group justify="space-between">
        <MultiSelect
          placeholder="Filtre as imagens pelo que há nelas..."
          data={['cat', 'dog', 'bird', 'fish', 'rabbit', 'person']}
          clearable
          searchable
          maw={800}
          style={{ flex: 1 }}
        />

        <RefreshPageButton />
      </Group>

      <SimpleGrid cols={{ xs: 2, md: 3, xl: 4 }}>
        {userImages.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
