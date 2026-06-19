import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata = {
  title: 'TechStore - Premium Phones & Laptops',
  description: 'Shop the latest phones and laptops at great prices',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
