import {
  IconDownload,
  IconHeart,
  IconHeartFilled,
  IconInfoCircle,
  IconRestore,
  IconShare,
  IconTrash,
} from '@tabler/icons-react';
import {
  Card,
  Image as MantineImage,
  Text,
  Group,
  Badge,
  ActionIcon,
  CardSection,
  Box,
  Divider,
  SimpleGrid,
  Tooltip,
} from '@mantine/core';

import type { Image } from '@/types';

export type ImageCardProps = {
  image: Image;
  withRestoreButton?: boolean;
};

export function ImageCard({
  image,
  withRestoreButton = false,
}: ImageCardProps) {
  return (
    <Card pb="sm">
      <CardSection>
        <MantineImage
          src={image.url}
          alt={image.metadata?.name ?? ''}
          height={220}
        />
      </CardSection>

      <Box mt="sm">
        <Group justify="space-between" gap="xs">
          <Text fz="lg" fw="bold" truncate="end" style={{ flex: 1 }}>
            {image.metadata?.name ?? 'Sem título'}
          </Text>

          <Badge>
            {image.accessGrantType === 'PRIVATE' ? 'Privado' : 'Público'}
          </Badge>
        </Group>

        {image?.description && <Text fz="sm">{image?.description}</Text>}
      </Box>

      <CardSection py="sm">
        <Divider />
      </CardSection>

      <Box>
        <Text inline c="dimmed" tt="uppercase" fw="bold" fz="xs">
          Tags
        </Text>

        {image.tags.length > 0 ? (
          <Group gap={8} mt={6}>
            {image.tags.map((tag) => (
              <Badge key={tag.id}>{tag.label ?? tag.key}</Badge>
            ))}
          </Group>
        ) : (
          <Text c="dimmed" fz="sm" mt={6}>
            Não categorizado
          </Text>
        )}
      </Box>

      <CardSection py="sm" mt="auto">
        <Divider />
      </CardSection>

      <Group justify="space-between">
        <Tooltip label="Excluir">
          <ActionIcon variant="subtle">
            <IconTrash />
          </ActionIcon>
        </Tooltip>

        {withRestoreButton && (
          <Tooltip label="Restaurar">
            <ActionIcon variant="subtle">
              <IconRestore />
            </ActionIcon>
          </Tooltip>
        )}

        <Tooltip label="Compartilhar">
          <ActionIcon variant="subtle">
            <IconShare />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Ver detalhes">
          <ActionIcon variant="subtle">
            <IconInfoCircle />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Baixar">
          <ActionIcon variant="subtle">
            <IconDownload />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Favoritar">
          <ActionIcon variant="subtle" c={image.favorite ? 'red' : undefined}>
            {image.favorite ? <IconHeartFilled /> : <IconHeart />}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );
}

export function ImageCardGrid({ children }: { children: React.ReactNode }) {
  return <SimpleGrid cols={{ xs: 2, md: 3, xl: 4 }}>{children}</SimpleGrid>;
}
