import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const dmSerif = DM_Serif_Display({ 
  subsets: ['latin'], 
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-dm-serif' 
})

export const metadata = {
  title: 'HelpMeProcess',
  description: 'Data-backed physical product opportunities',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerif.variable}`}>
        {children}
      </body>
    </html>
  )
}