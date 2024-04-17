import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WagmiProviderWrapper } from '@/lib/WagmiProviderWrapper';
import { ThemeProvider } from '@/lib/themeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ethlas Vault',
  description: 'A Secure ERC20 Token Vault',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
     
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange
        >
          <WagmiProviderWrapper>{children}</WagmiProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
