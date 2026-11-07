import { Roboto } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import './globals.css';

import ReportWebVitals from '@/components/ReportWebVitals';

const roboto = Roboto({
  weight: ['100', '300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata = {
  title: 'Optical character recognition',
  description:
    'Optical Character Recognition (OCR) is the process that converts an image of text into a machine-readable text format.',
  applicationName: 'OCR',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        {children}
        <ReportWebVitals />
      </body>
    </html>
  );
}
