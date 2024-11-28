import { Card, Group, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';
import Link from 'next/link';

import type { Album } from '@/types';

export type AlbumCardProps = {
  album: Album;
};

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Card component={Link} href={`/dashboard/albums/${album.id}`} p="sm">
      <Group wrap="wrap" gap="xs">
        <ThemeIcon variant="light" size="lg">
          <IconFolder />
        </ThemeIcon>

        <Text truncate="end" style={{ flex: 1 }}>
          {album.title}
        </Text>
      </Group>
    </Card>
  );
}

export function AlbumCardGrid({ children }: { children: React.ReactNode }) {
  return <SimpleGrid cols={{ xs: 2, md: 3, xl: 4 }}>{children}</SimpleGrid>;
}
