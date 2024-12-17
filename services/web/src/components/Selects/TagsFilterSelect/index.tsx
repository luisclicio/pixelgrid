'use client';

import { MultiSelect, MultiSelectProps } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { Tag } from '@/types';

export type TagsFilterSelectProps = Omit<
  MultiSelectProps,
  | 'data'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'leftSection'
  | 'placeholder'
  | 'clearable'
  | 'searchable'
> & {
  tags: Tag[];
  withReplace?: boolean;
};

export function TagsFilterSelect({
  tags,
  withReplace = false,
  ...props
}: TagsFilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTags: Tag['key'][] =
    searchParams.get('tags')?.split(';;') ?? [];

  function handleValueChange(value: Tag['key'][]) {
    const params = new URLSearchParams(searchParams);

    if (value.length > 0) {
      params.set('tags', value.join(';;'));
    } else {
      params.delete('tags');
    }

    if (withReplace) {
      router.replace(`?${params.toString()}`);
    } else {
      router.push(`?${params.toString()}`);
    }
  }

  return (
    <MultiSelect
      placeholder="Filtre as imagens pelo que há nelas..."
      data={tags.map((tag) => ({
        value: tag.key,
        label: tag.label ?? tag.key,
      }))}
      searchable
      clearable
      value={selectedTags}
      onChange={handleValueChange}
      leftSection={<IconSearch size={20} />}
      maw={props?.maw ?? 800}
      style={{ flex: 1, ...props.style }}
      {...props}
    />
  );
}
