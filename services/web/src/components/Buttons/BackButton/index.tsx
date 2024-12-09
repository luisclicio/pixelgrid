'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <Tooltip label="Voltar">
      <ActionIcon onClick={() => router.back()}>
        <IconArrowLeft />
      </ActionIcon>
    </Tooltip>
  );
}
