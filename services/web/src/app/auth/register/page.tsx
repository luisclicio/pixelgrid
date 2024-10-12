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

import type { RegisterSchema } from '@/types';
import {
  handleCredentialsRegister,
  type HandleCredentialsRegister,
} from '@/actions/auth';
import { registerSchema } from '@/libs/validation';

export default function AuthRegister() {
  const form = useForm<RegisterSchema>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      password: '',
    },

    validate: zodResolver(registerSchema),
  });
  const registerMutation = useMutation({
    mutationFn: async (values: HandleCredentialsRegister) => {
      await handleCredentialsRegister(values);
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    registerMutation.reset();

    form.onSubmit(async ({ name, email, password }) => {
      registerMutation.mutate({
        name,
        email,
        password,
      });
    })(event);
  }

  return (
    <>
      <Title ta="center">Seja bem-vindo!</Title>

      <Text c="dimmed" ta="center">
        Preencha os campos abaixo para criar sua conta.
      </Text>

      <Paper p="md" mt="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Nome"
              placeholder="Informe seu nome"
              withAsterisk
              key={form.key('name')}
              {...form.getInputProps('name')}
            />

            <TextInput
              label="E-mail"
              type="email"
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
              loading={registerMutation.isPending}
              disabled={registerMutation.isPending}
            >
              Enviar
            </Button>
          </Stack>
        </form>

        {registerMutation.isError && (
          <Alert
            mt="md"
            color="red"
            icon={<IconInfoCircle />}
            title={
              registerMutation.error?.message || 'Erro ao realizar cadastro'
            }
          >
            Verifique suas credenciais e tente novamente.
          </Alert>
        )}
      </Paper>

      <Text c="dimmed" size="sm" ta="center" mt="xs">
        Já tem uma conta?{' '}
        <Anchor size="sm" component={Link} href="/auth/login">
          Entrar
        </Anchor>
        .
      </Text>
    </>
  );
}
