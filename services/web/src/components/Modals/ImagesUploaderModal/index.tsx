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
import { hasLength, useForm } from '@mantine/form';
import { useId } from '@mantine/hooks';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';

export const IMAGES_UPLOADER_MODAL_KEY = 'IMAGES_UPLOADER_MODAL_KEY';

export function ImagesUploaderModal({ context, id }: ContextModalProps) {
  const dropzoneId = useId();
  const form = useForm<{ files: File[] }>({
    initialValues: {
      files: [],
    },

    validate: {
      files: hasLength({ min: 1 }, 'Selecione pelo menos uma imagem'),
    },
  });
  const filesList = form.getTransformedValues().files;
  const filesUrlsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const filesUrls = filesUrlsRef.current;

    return () => {
      Object.values(filesUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
              onClick={() => context.closeModal(id)}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={!form.isValid()}>
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
