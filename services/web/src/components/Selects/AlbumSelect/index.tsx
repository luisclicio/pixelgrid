import { Select, SelectProps } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { listUserAlbums } from '@/actions/albums';

export type AlbumSelectProps = Omit<
  SelectProps,
  'data' | 'label' | 'placeholder' | 'searchable'
>;

export function AlbumSelect(props: AlbumSelectProps) {
  const userAlbumsQuery = useQuery({
    queryKey: ['albums'],
    queryFn: async () => {
      return await listUserAlbums();
    },
  });

  return (
    <Select
      label="Álbum"
      placeholder="Selecione um álbum"
      searchable
      data={userAlbumsQuery.data?.map((album) => ({
        label: album.title,
        value: album.id,
      }))}
      {...props}
    />
  );
}
