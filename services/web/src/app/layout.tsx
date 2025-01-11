import '@/styles/globals.css';

import type { Metadata } from 'next';
import { ColorSchemeScript } from '@mantine/core';

import { UmamiAnalytics } from '@/components/Analytics/Umami';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'PixelGrid',
  description: 'PixelGrid - Your gallery organized by artificial intelligence',
  keywords:
    'pixelgrid, gallery, artificial intelligence, image classification, photo organization',
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
        <UmamiAnalytics />
      </head>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
