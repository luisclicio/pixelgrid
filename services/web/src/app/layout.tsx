import '@/styles/globals.css';

import type { Metadata } from 'next';
import { ColorSchemeScript } from '@mantine/core';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'PixelGrid',
  description: 'PixelGrid - The image classification tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
