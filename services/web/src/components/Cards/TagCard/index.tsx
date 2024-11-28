import { Card, Group, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { IconHash } from '@tabler/icons-react';
import Link from 'next/link';

import type { Tag } from '@/types';

export type TagCardProps = {
  tag: Tag;
};

export function TagCard({ tag }: TagCardProps) {
  return (
    <Card component={Link} href={`/dashboard/tags/${tag.id}`} p="sm">
      <Group wrap="wrap" gap="xs">
        <ThemeIcon variant="light" size="lg">
          <IconHash />
        </ThemeIcon>

        <Text truncate="end" style={{ flex: 1 }}>
          {tag.label ?? tag.key}
        </Text>
      </Group>
    </Card>
  );
}

export function TagCardGrid({ children }: { children: React.ReactNode }) {
  return <SimpleGrid cols={{ xs: 2, md: 3, xl: 4 }}>{children}</SimpleGrid>;
}
