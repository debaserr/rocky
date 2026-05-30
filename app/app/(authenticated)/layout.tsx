import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { NavTabBar } from '@/components/ui/nav-tab-bar';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div
      style={{
        maxWidth: 390,
        margin: '0 auto',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main style={{ flex: 1 }}>{children}</main>
      <NavTabBar />
    </div>
  );
}
