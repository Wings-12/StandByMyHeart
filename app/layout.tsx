import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from './providers';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIコーチング',
  description: 'パーソナライズされたAIコーチングシステム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <nav className="border-b">
              <div className="container mx-auto px-4 py-3">
                <div className="flex gap-4">
                  <Link href="/" className="hover:text-primary">
                    AIコーチング
                  </Link>
                  <Link href="/journal" className="hover:text-primary">
                    ジャーナル
                  </Link>
                  <Link href="/auth" className="hover:text-primary ml-auto">
                    ログイン
                  </Link>
                </div>
              </div>
            </nav>
            {children}
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}