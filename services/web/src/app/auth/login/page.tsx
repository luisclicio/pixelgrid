'use client';

import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation } from '@tanstack/react-query';
import { IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';

import type { LoginSchema } from '@/types';
import {
  handleCredentialsLogin,
  type HandleCredentialsLogin,
} from '@/actions/auth';
import { loginSchema } from '@/libs/validation';

export default function AuthLogin({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const form = useForm<LoginSchema>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },

    validate: zodResolver(loginSchema),
  });
  const loginMutation = useMutation({
    mutationFn: async (values: HandleCredentialsLogin) => {
      await handleCredentialsLogin(values);
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    loginMutation.reset();

    form.onSubmit(async ({ email, password }) => {
      loginMutation.mutate({
        email,
        password,
        ...(searchParams?.redirect
          ? { redirectTo: searchParams.redirect }
          : {}),
      });
    })(event);
  }

  return (
    <>
      <Title ta="center">Bem-vindo de volta!</Title>

      <Text c="dimmed" ta="center">
        Insira suas credenciais para continuar.
      </Text>

      <Paper p="md" mt="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="E-mail"
              placeholder="Informe seu e-mail"
              withAsterisk
              key={form.key('email')}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Senha"
              placeholder="Informe sua senha"
              withAsterisk
              key={form.key('password')}
              {...form.getInputProps('password')}
            />

            <Button
              type="submit"
              fullWidth
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
            >
              Enviar
            </Button>
          </Stack>
        </form>

        {loginMutation.isError && (
          <Alert
            mt="md"
            color="red"
            icon={<IconInfoCircle />}
            title={
              loginMutation.error?.message || 'Erro ao realizar autenticação'
            }
          >
            Verifique suas credenciais e tente novamente.
          </Alert>
        )}
      </Paper>

      <Text c="dimmed" size="sm" ta="center" mt="xs">
        Não se registrou ainda?{' '}
        <Anchor size="sm" component={Link} href="/auth/register">
          Criar conta
        </Anchor>
        .
      </Text>
    </>
  );
}
