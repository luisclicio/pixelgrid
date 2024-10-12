import {
  Menu,
  MenuTarget,
  ActionIcon,
  MenuDropdown,
  Tooltip,
  type MenuProps,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

export type OptionsMenuProps = { children: React.ReactNode } & MenuProps;

export function OptionsMenu({
  children,
  width = 160,
  ...props
}: OptionsMenuProps) {
  return (
    <Menu width={width} {...props}>
      <MenuTarget>
        <Tooltip label="Opções" position="left">
          <ActionIcon>
            <IconDotsVertical size={18} />
          </ActionIcon>
        </Tooltip>
      </MenuTarget>

      <MenuDropdown>{children}</MenuDropdown>
    </Menu>
  );
}
