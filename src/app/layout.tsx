
import { Inter } from "next/font/google"
import Image from 'next/image'
import './globals.css'
import { cn } from "@/lib/utils"

export const metadata = {
  title: 'Security Module',
  description: 'Security Module',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" className='h-full'>
        <body
          className={cn(
            'relative h-full font-sans antialiased',
            inter.className
          )}>

          <main className='relative flex flex-col min-h-screen'>
            <div className='flex-grow flex-1'>
              {children}
            </div>
          </main>
        </body>
      </html>
    </>
  )
}