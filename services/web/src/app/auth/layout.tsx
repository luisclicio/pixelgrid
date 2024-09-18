'use client';

import { Center, Container, useComputedColorScheme } from '@mantine/core';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const computedColorScheme = useComputedColorScheme('dark', {
    getInitialValueInEffect: true,
  });

  return (
    <Center
      mih="100vh"
      w="100%"
      bg={computedColorScheme === 'light' ? 'gray.0' : 'dark.9'}
    >
      <Container size="xs" w="100%">
        {children}
      </Container>
    </Center>
  );
}
