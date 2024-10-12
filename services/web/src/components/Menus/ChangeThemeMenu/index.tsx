'use client';

import { Button, Menu, useMantineColorScheme } from '@mantine/core';
import {
  IconDeviceDesktop,
  IconMoon,
  IconSelector,
  IconSun,
} from '@tabler/icons-react';

export function ChangeThemeMenu() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Menu radius="md" width="target">
      <Menu.Target>
        <Button
          variant="default"
          fullWidth
          justify="space-between"
          leftSection={
            colorScheme === 'auto' ? (
              <IconDeviceDesktop size={18} />
            ) : colorScheme === 'light' ? (
              <IconSun size={18} />
            ) : (
              <IconMoon size={18} />
            )
          }
          rightSection={<IconSelector size={18} />}
          styles={{
            label: {
              width: '100%',
            },
          }}
        >
          Tema
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconDeviceDesktop size={18} />}
          onClick={() => setColorScheme('auto')}
        >
          Sistema
        </Menu.Item>

        <Menu.Item
          leftSection={<IconSun size={18} />}
          onClick={() => setColorScheme('light')}
        >
          Claro
        </Menu.Item>

        <Menu.Item
          leftSection={<IconMoon size={18} />}
          onClick={() => setColorScheme('dark')}
        >
          Escuro
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
