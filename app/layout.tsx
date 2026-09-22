import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Alpha Tech | Advanced Engineering & E-Commerce Platform',
  description: 'Precision drone components, robotics equipment, LiPo batteries, carbon fiber materials, and rapid custom 3D printing & CAD engineering services.',
  openGraph: {
    title: 'Alpha Tech | Advanced Engineering & E-Commerce Platform',
    description: 'Precision drone components, robotics equipment, LiPo batteries, carbon fiber materials, and rapid custom 3D printing & CAD engineering services.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alpha Tech | Advanced Engineering & E-Commerce Platform',
    description: 'Precision drone components, robotics equipment, LiPo batteries, carbon fiber materials, and rapid custom 3D printing & CAD engineering services.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
