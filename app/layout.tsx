import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { DemoProvider } from '@/context/DemoContext';
import { AutopilotProvider } from '@/context/AutopilotContext';
import { Toaster } from 'react-hot-toast';
import PageBackground from '@/components/PageBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
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
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased text-[#F0F4FF]`}>
        <PageBackground />
        <DemoProvider>
          <AutopilotProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#162040',
                  color: '#F0F4FF',
                  border: '1px solid rgba(255, 107, 53, 0.2)',
                },
                success: {
                  iconTheme: {
                    primary: '#00C9A7',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <AppLayoutWrapper>
              {children}
            </AppLayoutWrapper>
          </AutopilotProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
