import { auth } from '@/services/auth';
import { DashboardLayout } from '@/components/Layouts/Dashboard';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
