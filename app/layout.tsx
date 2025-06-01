import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HomeShare - Find your next stay',
  description: 'A platform for sharing homes and earning tokens',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90',
          footerActionLink: 'text-primary hover:text-primary/90',
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
