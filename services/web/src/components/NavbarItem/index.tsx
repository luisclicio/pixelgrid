import { NavLink } from '@mantine/core';
import Link from 'next/link';

export type NavbarItemData =
  | {
      label: string;
      icon: React.ReactNode;
      href: string;
    }
  | {
      label: string;
      icon: React.ReactNode;
      links: {
        label: string;
        href: string;
      }[];
    };

export function NavbarItem({
  item,
  pathname,
}: {
  item: NavbarItemData;
  pathname: string;
}) {
  if ('links' in item) {
    return (
      <NavLink
        key={item.label}
        label={item.label}
        leftSection={item.icon}
        defaultOpened={item.links.some((link) =>
          pathname.startsWith(link.href)
        )}
      >
        {item.links.map((link) => (
          <NavLink
            key={link.href}
            component={Link}
            label={link.label}
            href={link.href}
            active={pathname === link.href}
          />
        ))}
      </NavLink>
    );
  }

  if ('href' in item) {
    return (
      <NavLink
        key={item.label}
        component={Link}
        label={item.label}
        href={item.href}
        active={pathname === item.href}
        leftSection={item.icon}
      />
    );
  }

  return null;
}
