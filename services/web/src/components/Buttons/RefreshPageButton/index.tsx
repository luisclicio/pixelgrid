'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconReload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export function RefreshPageButton() {
  const router = useRouter();

  return (
    <Tooltip label="Atualizar">
      <ActionIcon onClick={() => router.refresh()}>
        <IconReload />
      </ActionIcon>
    </Tooltip>
  );
}
