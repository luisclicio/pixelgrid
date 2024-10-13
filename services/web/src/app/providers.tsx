'use client';

import 'dayjs/locale/pt-br';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ImagesUploaderModal } from '@/components/Modals/ImagesUploaderModal';

import { theme } from './theme';

const modals = {
  [ImagesUploaderModal.key]: ImagesUploaderModal,
};

declare module '@mantine/modals' {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: true,
        },
      },
    })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications
            position="top-center"
            autoClose={10000}
            zIndex={1000}
          />

          <DatesProvider settings={{ locale: 'pt-br', firstDayOfWeek: 0 }}>
            <ModalsProvider modals={modals}>{children}</ModalsProvider>
          </DatesProvider>
        </MantineProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
