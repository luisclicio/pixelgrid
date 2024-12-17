import { Group, Stack, Text, Title, Tooltip } from '@mantine/core';

import { listUserImages } from '@/actions/images';
import { getTag } from '@/actions/tags';
import { ImageCard, ImageCardGrid } from '@/components/Cards/ImageCard';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';
import { BackButton } from '@/components/Buttons/BackButton';

export default async function DashboardTag(props: {
  params: { tagId: string };
}) {
  const tag = await getTag(props.params.tagId);
  const userImages = await listUserImages({ tagsIds: [props.params.tagId] });

  return (
    <Stack>
      <Group justify="space-between">
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
