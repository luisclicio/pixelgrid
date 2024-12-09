import { Group, MultiSelect, Stack, Text, Title, Tooltip } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

import { listUserImages } from '@/actions/images';
import { getTag, listAvailableUserTags } from '@/actions/tags';
import { ImageCard, ImageCardGrid } from '@/components/Cards/ImageCard';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';
import { BackButton } from '@/components/Buttons/BackButton';

export default async function DashboardTag({
  params,
}: {
  params: { tagId: string };
}) {
  const tag = await getTag(params.tagId);
  const userImages = await listUserImages({ tagId: params.tagId });
  const userTags = await listAvailableUserTags();

  return (
    <Stack>
      <Group>
        <BackButton />

        <Group gap="xs">
          <Tooltip label={tag?.key}>
            <Title maw={300}>
              <Text truncate="end" inherit>
                {tag?.label || tag?.key}
              </Text>
            </Title>
          </Tooltip>
        </Group>
      </Group>

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
