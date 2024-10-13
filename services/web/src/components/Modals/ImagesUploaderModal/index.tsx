'use client';

import {
  closeModal,
  openContextModal,
  type ContextModalProps,
} from '@mantine/modals';
import {
  AspectRatio,
  Box,
  Button,
  CloseButton,
  Group,
  Image,
  Input,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  rem,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useForm, zodResolver } from '@mantine/form';
import { useId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconPhoto, IconX, IconCheck } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

import type { SaveImagesSchema } from '@/types';
import { saveImages } from '@/actions/images';
import { saveImagesSchema } from '@/libs/validation';

export const IMAGES_UPLOADER_MODAL_KEY = 'IMAGES_UPLOADER_MODAL_KEY';

export function ImagesUploaderModal({ context, id }: ContextModalProps) {
  const dropzoneId = useId();
  const form = useForm<SaveImagesSchema>({
    initialValues: {
      files: [],
    },

    validate: zodResolver(saveImagesSchema),
  });
  const filesList = form.getTransformedValues().files;
  const filesUrlsRef = useRef<Record<string, string>>({});
  const imagesUploadMutation = useMutation({
    mutationFn: async (values: typeof form.values) => {
      const formData = new FormData();

      values.files.forEach((file) => formData.append('files', file));

      await saveImages(formData);
    },
    onSuccess: () => {
      context.closeModal(id);
      form.reset();
      notifications.show({
        title: 'Imagens enviadas com sucesso!',
        message: 'As imagens foram enviadas e serão organizadas em breve.',
        color: 'teal',
        icon: <IconCheck />,
      });
    },
    onError: (error) => {
      console.error(error.message);
      notifications.show({
        title: 'Erro ao enviar imagens!',
        message: 'Verifique sua conexão e tente novamente.',
        color: 'red',
        icon: <IconX />,
      });
    },
  });

  async function handleSubmit(values: typeof form.values) {
    imagesUploadMutation.reset();
    imagesUploadMutation.mutate(values);
  }

  async function handleReset() {
    context.closeModal(id);
    form.reset();
  }

  useEffect(() => {
    const filesUrls = filesUrlsRef.current;

    return () => {
      Object.values(filesUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)} onReset={handleReset}>
        <Stack>
          <Input.Wrapper
            id={dropzoneId}
            withAsterisk
            error={form.errors.files}
            styles={{ error: { marginTop: rem(5) } }}
          >
            <Dropzone
              id={dropzoneId}
              maxSize={5 * 1024 ** 2} // 5 MB
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
              disabled={imagesUploadMutation.isPending}
              onDrop={(files) => {
                form.setFieldValue('files', (prevFiles) =>
                  [...prevFiles, ...files].filter(
                    (file, index, array) =>
                      array.findIndex((f) => f.name === file.name) === index
                  )
                );
              }}
              onReject={(files) => console.log('Arquivos rejeitados', files)}
              {...form.getInputProps('files')}
            >
              <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: 'none' }}
              >
                <Dropzone.Accept>
                  <IconUpload
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: 'var(--mantine-color-blue-6)',
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Accept>

                <Dropzone.Reject>
                  <IconX
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: 'var(--mantine-color-red-6)',
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Reject>

                <Dropzone.Idle>
                  <IconPhoto
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: 'var(--mantine-color-dimmed)',
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>

                <div>
                  <Dropzone.Idle>
                    <Text size="xl" inline>
                      Arraste imagens aqui ou clique para selecionar
                    </Text>
                  </Dropzone.Idle>

                  <Dropzone.Accept>
                    <Text size="xl" inline>
                      Solte as imagens para adicionar
                    </Text>
                  </Dropzone.Accept>

                  <Dropzone.Reject>
                    <Text size="xl" inline>
                      Apenas imagens PNG e JPEG são permitidas
                    </Text>
                  </Dropzone.Reject>

                  <Text size="sm" c="dimmed" inline mt="xs">
                    Anexe quantas imagens desejar, cada imagem não deve exceder
                    5 MB
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </Input.Wrapper>

          {filesList.length > 0 && (
            <ScrollArea.Autosize mah={rem(340)} type="scroll">
              <SimpleGrid cols={{ base: 3, sm: 4 }}>
                {filesList.map((file, index) => {
                  if (!(file.name in filesUrlsRef.current)) {
                    filesUrlsRef.current[file.name] = URL.createObjectURL(file);
                  }

                  const url = filesUrlsRef.current[file.name];

                  return (
                    <Box key={index} pos="relative">
                      <AspectRatio ratio={1}>
                        <Image
                          src={url}
                          alt={file.name}
                          fit="cover"
                          radius="md"
                          loading="lazy"
                        />
                      </AspectRatio>

                      <CloseButton
                        aria-label={`Remover ${file.name}`}
                        bg="var(--mantine-color-body)"
                        c="red"
                        pos="absolute"
                        top={4}
                        right={4}
                        disabled={imagesUploadMutation.isPending}
                        onClick={() => {
                          form.removeListItem('files', index);
                          URL.revokeObjectURL(url);
                        }}
                      />
                    </Box>
                  );
                })}
              </SimpleGrid>
            </ScrollArea.Autosize>
          )}

          <Group justify="flex-end">
            <Button
              type="reset"
              variant="default"
              disabled={imagesUploadMutation.isPending}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!form.isValid() || imagesUploadMutation.isPending}
              loading={imagesUploadMutation.isPending}
            >
              Enviar
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}

export function openImagesUploaderModal() {
  openContextModal({
    modal: IMAGES_UPLOADER_MODAL_KEY,
    title: 'Enviar imagens',
    innerProps: {},
  });
}

export function closeImagesUploaderModal() {
  closeModal(IMAGES_UPLOADER_MODAL_KEY);
}

ImagesUploaderModal.key = IMAGES_UPLOADER_MODAL_KEY;
