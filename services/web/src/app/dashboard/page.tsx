import { Button, Title } from '@mantine/core';

import { auth } from '@/services/auth';
import { handleSignOut } from '@/actions/auth';

export default async function DashboardHome() {
  const session = await auth();

  return (
    <>
      <Title>Olá, {session?.user.name}!</Title>
      <form action={handleSignOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </>
  );
}
