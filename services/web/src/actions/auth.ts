'use server';

import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';

import type { LoginSchema, RegisterSchema } from '@/types';
import { signIn, signOut } from '@/services/auth';
import { prisma } from '@/services/db';

export type HandleCredentialsLogin = LoginSchema & {
  redirectTo?: string;
};

export type HandleCredentialsRegister = RegisterSchema;

export async function handleCredentialsLogin({
  email,
  password,
  redirectTo = '/dashboard',
}: HandleCredentialsLogin) {
  try {
    await signIn('credentials', { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Credenciais inválidas.');
        default:
          throw new Error('Erro ao realizar autenticação.');
      }
    }

    throw new Error('Erro ao realizar autenticação.');
  }
}

export async function handleCredentialsRegister({
  email,
  password,
  name,
}: HandleCredentialsRegister) {
  try {
    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Erro ao realizar cadastro.');
  }

  await handleCredentialsLogin({ email, password });
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/auth/login' });
}
