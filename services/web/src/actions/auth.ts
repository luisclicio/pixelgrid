'use server';

import { AuthError } from 'next-auth';

import type { LoginSchema, RegisterSchema } from '@/types';
import { signIn, signOut } from '@/services/auth';

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

    throw error;
  }
}

export async function handleCredentialsRegister({
  email,
  password,
  name,
}: HandleCredentialsRegister) {
  try {
    // TODO: Create user on database
    console.log('User created:', { email, name });
  } catch {
    throw new Error('Erro ao realizar cadastro.');
  }

  await handleCredentialsLogin({ email, password });
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/auth/login' });
}
