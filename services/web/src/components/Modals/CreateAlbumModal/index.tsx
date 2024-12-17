'use client';

import {
  closeModal,
  openContextModal,
  type ContextModalProps,
} from '@mantine/modals';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconX, IconCheck } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import type { SaveAlbumSchema } from '@/types';
import { saveAlbum } from '@/actions/albums';
import { saveAlbumSchema } from '@/libs/validation';

export const CREATE_ALBUM_MODAL_KEY = 'CREATE_ALBUM_MODAL_KEY';

export function CreateAlbumModal({
  context,
  id,
}: ContextModalProps<Record<string, never>>) {
  const router = useRouter();
  const form = useForm<SaveAlbumSchema>({
    initialValues: {
      title: '',
    },

    validate: zodResolver(saveAlbumSchema),
  });
  const createAlbumMutation = useMutation({
    mutationFn: async (values: typeof form.values) => {
      const result = await saveAlbum(values);

      if (result.status === 'ERROR') {
        throw new Error('Failed to save album');
      }

      return result.data;
    },
    onSuccess: () => {
      context.closeModal(id);
      form.reset();
      notifications.show({
        title: 'Álbum criado com sucesso!',
        message: 'O álbum foi criado e já está disponível.',
        color: 'teal',
        icon: <IconCheck />,
      });
      router.refresh();
    },
    onError: (error) => {
      console.error(error.message);
      notifications.show({
        title: 'Erro ao criar álbum',
        message: 'Verifique sua conexão e tente novamente.',
        color: 'red',
        icon: <IconX />,
      });
    },
  });

  async function handleSubmit(values: typeof form.values) {
    createAlbumMutation.reset();
    createAlbumMutation.mutate(values);
  }

  async function handleReset() {
    context.closeModal(id);
    form.reset();
  }

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)} onReset={handleReset}>
        <Stack>
          <TextInput
            label="Título do álbum"
            placeholder="Informe o título do álbum"
            withAsterisk
            key={form.key('title')}
            {...form.getInputProps('title')}
          />

          <Group justify="flex-end">
            <Button
              type="reset"
              variant="default"
              disabled={createAlbumMutation.isPending}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!form.isValid() || createAlbumMutation.isPending}
              loading={createAlbumMutation.isPending}
            >
              Salvar
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}

export function openCreateAlbumModal() {
  openContextModal({
    modal: CREATE_ALBUM_MODAL_KEY,
    title: 'Cadastrar álbum',
    size: 'md',
    innerProps: {},
  });
}

export function closeCreateAlbumModal() {
  closeModal(CREATE_ALBUM_MODAL_KEY);
}

CreateAlbumModal.key = CREATE_ALBUM_MODAL_KEY;
