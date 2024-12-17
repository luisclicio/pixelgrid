import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório' })
    .min(1, 'O e-mail é obrigatório')
    .email('E-mail inválido'),
  password: z
    .string({ required_error: 'A senha é obrigatória' })
    .min(1, 'A senha é obrigatória')
    .min(8, 'A senha deve ter no mínimo 8 caracteres'),
});

export const registerSchema = loginSchema.extend({
  name: z
    .string({ required_error: 'O nome é obrigatório' })
    .min(1, 'O nome é obrigatório'),
});

export const saveImagesSchema = z.object({
  albumId: z
    .string({ required_error: 'O álbum é obrigatório' })
    .min(1, 'O álbum é obrigatório'),
  files: z.array(z.instanceof(File)).min(1, 'Selecione pelo menos uma imagem'),
});

export const saveAlbumSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório' })
    .min(1, 'O título é obrigatório'),
});

export const changeResourceAccessSchema = z.object({
  type: z.enum(['album', 'image']),
  id: z.string(),
  accessGrantType: z.enum(['PUBLIC', 'PRIVATE']),
});
