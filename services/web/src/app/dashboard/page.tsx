import { Title } from '@mantine/core';

import { auth } from '@/services/auth';

export default async function DashboardHome() {
  const session = await auth();

  return (
    <>
      <Title>Olá, {session?.user.name}!</Title>
    </>
  );
}
