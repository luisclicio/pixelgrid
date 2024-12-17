'use client';

import { Autocomplete, AutocompleteProps } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import type { Album, Tag } from '@/types';

export type SearchFilterInputProps = Omit<
  AutocompleteProps,
  | 'data'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'leftSection'
  | 'clearable'
  | 'searchable'
> & {
  albums: Album[];
  tags: Tag[];
};

export function SearchFilterInput({
  albums,
  tags,
  ...props
}: SearchFilterInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(searchQuery);

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value.trim().length > 0) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    router.replace(`?${params.toString()}`);
  }, 300);

  function handleValueChange(value: string) {
    setSearch(value);
    handleSearch(value);
  }

  return (
    <Autocomplete
      data={[
        {
          group: 'Álbuns',
          items: Array.from(new Set(albums.map((album) => album.title))),
        },
        {
          group: 'Tags',
          items: Array.from(new Set(tags.map((tag) => tag.label ?? tag.key))),
        },
      ]}
      value={search}
      onChange={handleValueChange}
      leftSection={<IconSearch size={20} />}
      maw={props?.maw ?? 800}
      style={{ flex: 1, ...props.style }}
      {...props}
    />
  );
}
