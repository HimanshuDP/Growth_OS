import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { DemoProvider } from '@/context/DemoContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GrowthOS — AI Marketing Engine for Indian SMEs',
    template: '%s | GrowthOS',
  },
  description:
    'Zero-touch autonomous digital marketing platform powered by AI. Generate content calendars, captions, and ad campaigns tailored for Indian festivals and SMEs.',
  keywords: ['AI marketing', 'Indian SME', 'content calendar', 'social media', 'Diwali campaigns'],
  authors: [{ name: 'GrowthOS Team' }],
  openGraph: {
    title: 'GrowthOS — AI Marketing Engine',
    description: 'Replace your ₹50,000/month social media agency with AI.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-white`}>
        <DemoProvider>
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e1b4b',
                color: '#fff',
                border: '1px solid rgba(79, 70, 229, 0.2)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
            }}
          />
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </DemoProvider>
      </body>
    </html>
  );
}
