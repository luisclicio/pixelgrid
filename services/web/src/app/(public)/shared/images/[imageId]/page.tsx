import {
  Badge,
  Card,
  CardSection,
  Group,
  Image,
  Stack,
  Title,
} from '@mantine/core';
import { notFound } from 'next/navigation';

import { getImage } from '@/actions/images';
import { RefreshPageButton } from '@/components/Buttons/RefreshPageButton';

export default async function SharedImage(props: {
  params: { imageId: string };
}) {
  const image = await getImage(props.params.imageId);

  if (!image || image?.accessGrantType === 'PRIVATE') {
    return notFound();
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title>{image.metadata?.name}</Title>

        <RefreshPageButton />
      </Group>

      {image.tags.length > 0 && (
        <Group gap={8}>
          {image.tags.map((tag) => (
            <Badge key={tag.id}>{tag.label ?? tag.key}</Badge>
          ))}
        </Group>
      )}

      <Card>
        <CardSection>
          <Image src={image.url} alt={image.metadata?.name ?? ''} />
        </CardSection>
      </Card>
    </Stack>
  );
}
