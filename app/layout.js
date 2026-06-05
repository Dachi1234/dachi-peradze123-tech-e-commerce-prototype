import './globals.css'

export const metadata = {
  title: 'TechStore - Premium Phones & Laptops',
  description: 'Shop the latest phones and laptops at great prices',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
