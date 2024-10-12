import { Avatar, Menu, type MenuProps } from '@mantine/core';

export type UserProfileMenuProps = {
  user: {
    name?: string;
    avatarUrl?: string | null;
  };
  children: React.ReactNode;
} & MenuProps;

export function UserProfileMenu({
  user,
  children,
  ...props
}: UserProfileMenuProps) {
  return (
    <Menu width={200} position="bottom-end" {...props}>
      <Menu.Target>
        <Avatar
          variant="default"
          src={user?.avatarUrl}
          name={user?.name}
          style={{ cursor: 'pointer' }}
        />
      </Menu.Target>

      <Menu.Dropdown>{children}</Menu.Dropdown>
    </Menu>
  );
}
