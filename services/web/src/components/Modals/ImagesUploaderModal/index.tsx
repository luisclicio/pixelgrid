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
import { useMutation } from '@tanstack/react-query';

import type { SaveImagesSchema } from '@/types';
import { saveImages } from '@/actions/images';
import { saveImagesSchema } from '@/libs/validation';

export const IMAGES_UPLOADER_MODAL_KEY = 'IMAGES_UPLOADER_MODAL_KEY';

/**
 * Store to keep track of selected images and their URLs
 */
class SelectedImagesStore {
  private selectedImagesMap: Map<string, { file: File; url: string }> =
    new Map();

  get values() {
    return Array.from(this.selectedImagesMap.values());
  }

  get size() {
    return this.selectedImagesMap.size;
  }

  add(file: File) {
    if (this.selectedImagesMap.has(file.name)) {
      return;
    }

    const url = URL.createObjectURL(file);
    this.selectedImagesMap.set(file.name, { file, url });
  }

  get(filename: string) {
    return this.selectedImagesMap.get(filename);
  }

  remove(filename: string) {
    const image = this.selectedImagesMap.get(filename);

    if (image) {
      URL.revokeObjectURL(image.url);
      this.selectedImagesMap.delete(filename);
    }
  }

  clear() {
    this.selectedImagesMap.forEach(({ url }) => URL.revokeObjectURL(url));
    this.selectedImagesMap.clear();
  }
}

const selectedImagesStore = new SelectedImagesStore();

export function ImagesUploaderModal({ context, id }: ContextModalProps) {
  const dropzoneId = useId();
  const form = useForm<SaveImagesSchema>({
    initialValues: {
      files: selectedImagesStore.values.map(({ file }) => file),
    },

    validate: zodResolver(saveImagesSchema),

    onValuesChange(values, previousValues) {
      // Check for removed and added files to update the selected images store
      const files = values.files;
      const previousFiles = previousValues.files;

      const removedFiles = previousFiles.filter(
        (file) => !files.includes(file)
      );
      const addedFiles = files.filter((file) => !previousFiles.includes(file));

      removedFiles.forEach((file) => {
        selectedImagesStore.remove(file.name);
      });

      addedFiles.forEach((file) => {
        selectedImagesStore.add(file);
      });
    },
  });
  const filesList = form.getTransformedValues().files;
  const imagesUploadMutation = useMutation({
    mutationFn: async (values: typeof form.values) => {
      const formData = new FormData();

      values.files.forEach((file) => formData.append('files', file));

      await saveImages(formData);
    },
    onSuccess: () => {
      context.closeModal(id);
      form.reset();
      selectedImagesStore.clear();
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
    selectedImagesStore.clear();
  }

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
                gap="md"
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
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  <strong>{filesList.length}</strong>{' '}
                  {filesList.length > 1
                    ? 'imagens selecionadas'
                    : 'imagem selecionada'}
                </Text>

                <Button
                  variant="subtle"
                  size="compact-sm"
                  color="red"
                  disabled={imagesUploadMutation.isPending}
                  onClick={() => form.setFieldValue('files', [])}
                >
                  Limpar seleção
                </Button>
              </Group>

              <ScrollArea.Autosize mah={rem(340)} type="scroll">
                <SimpleGrid cols={{ base: 3, sm: 4 }}>
                  {filesList.map((file, index) => {
                    const url = selectedImagesStore.get(file.name)?.url;

                    if (!url) {
                      return null;
                    }

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
                          }}
                        />
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </ScrollArea.Autosize>
            </Stack>
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
