'use client';

import {
  closeModal,
  openContextModal,
  type ContextModalProps,
} from '@mantine/modals';
import { Button, CopyButton, Group, Select, Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconX, IconCheck, IconLink } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import type { Album, Image, ChangeResourceAccess } from '@/types';
import { changeResourceAccessSchema } from '@/libs/validation';
import { changeResourceAccess } from '@/actions/share';

export const SHARE_RESOURCE_MODAL_KEY = 'SHARE_RESOURCE_MODAL_KEY';

export type ShareResourceData =
  | {
      type: 'album';
      id: Album['id'];
      name: Album['title'];
      accessGrantType: Album['accessGrantType'];
    }
  | {
      type: 'image';
      id: Image['id'];
      name: Image['metadata']['name'];
      accessGrantType: Image['accessGrantType'];
    };

export function ShareResourceModal({
  context,
  id,
  innerProps: { resource },
}: ContextModalProps<{ resource: ShareResourceData }>) {
  const router = useRouter();
  const form = useForm<ChangeResourceAccess>({
    initialValues: {
      type: resource.type,
      id: resource.id,
      accessGrantType: resource.accessGrantType,
    },

    validate: zodResolver(changeResourceAccessSchema),
  });
  const shareResourceMutation = useMutation({
    mutationFn: async (values: typeof form.values) => {
      const result = await changeResourceAccess({
        type: values.type,
        id: values.id,
        accessGrantType: values.accessGrantType,
      });

      if (result.status === 'ERROR') {
        throw new Error('Failed to share resource');
      }

      return result.data;
    },
    onSuccess: () => {
      notifications.show({
        title: 'Visibilidade alterada',
        message: 'A visibilidade do item foi alterada com sucesso.',
        color: 'teal',
        icon: <IconCheck />,
      });
      router.refresh();
    },
    onError: (error) => {
      console.error(error.message);
      notifications.show({
        title: 'Erro ao alterar visibilidade',
        message: 'Verifique sua conexão e tente novamente.',
        color: 'red',
        icon: <IconX />,
      });
    },
  });

  async function handleSubmit(values: typeof form.values) {
    shareResourceMutation.reset();
    shareResourceMutation.mutate(values);
  }

  async function handleReset() {
    context.closeModal(id);
    form.reset();
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} onReset={handleReset}>
      <Stack>
        <Select
          label="Visibilidade"
          description={
            form.values.accessGrantType === 'PRIVATE'
              ? 'Somente você pode acessar.'
              : 'Qualquer pessoa poderá acessar.'
          }
          placeholder="Selecione a visibilidade"
          data={[
            { value: 'PRIVATE', label: 'Privado' },
            { value: 'PUBLIC', label: 'Público' },
          ]}
          key={form.key('accessGrantType')}
          {...form.getInputProps('accessGrantType')}
        />

        <Group justify="space-between">
          <CopyButton
            value={`${window.location.origin}/shared/${
              resource.type === 'album' ? 'albums' : 'images'
            }/${resource.id}`}
          >
            {({ copied, copy }) => (
              <Button
                variant={copied ? 'filled' : 'default'}
                leftSection={<IconLink />}
                onClick={copy}
              >
                {copied ? 'Link copiado!' : 'Copiar link'}
              </Button>
            )}
          </CopyButton>

          <Group justify="flex-end">
            <Button
              type="reset"
              variant="default"
              disabled={shareResourceMutation.isPending}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!form.isValid() || shareResourceMutation.isPending}
              loading={shareResourceMutation.isPending}
            >
              Salvar
            </Button>
          </Group>
        </Group>
      </Stack>
    </form>
  );
}

export function openShareResourceModal({
  resource,
}: {
  resource: ShareResourceData;
}) {
  openContextModal({
    modal: SHARE_RESOURCE_MODAL_KEY,
    title: resource?.name ? `Compartilhar "${resource.name}"` : 'Compartilhar',
    size: 'md',
    innerProps: {
      resource,
    },
  });
}

export function closeShareResourceModal() {
  closeModal(SHARE_RESOURCE_MODAL_KEY);
}

ShareResourceModal.key = SHARE_RESOURCE_MODAL_KEY;
