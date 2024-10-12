import { Box, Center, Container, Group } from '@mantine/core';
import cx from 'clsx';

import { LogoWithText } from '@/components/Logo';
import { ChangeThemeActionButton } from '@/components/Buttons/ChangeThemeButton';

import classes from './styles.module.css';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box mih="100vh" className={cx(classes.wrapper)}>
      <Group justify="flex-end" p="md" h={66}>
        <ChangeThemeActionButton />
      </Group>

      <Center h="calc(100% - 66px)" w="100%" className={cx(classes.content)}>
        <Container size="xs" w="100%">
          <LogoWithText mb="md" />

          {children}
        </Container>
      </Center>
    </Box>
  );
}
