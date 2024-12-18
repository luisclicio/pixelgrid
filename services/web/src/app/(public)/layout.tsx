import { PublicLayout } from '@/components/Layouts/Public';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicLayout>{children}</PublicLayout>;
}
