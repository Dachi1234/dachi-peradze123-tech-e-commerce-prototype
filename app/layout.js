import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'TechStore - Premium Phones & Laptops',
  description: 'Shop the latest phones and laptops at great prices',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#111111] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
