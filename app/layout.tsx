import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'FrameMix Photo Grid Studio',
  description: 'An interactive photo grid filter studio inspired by generative split-frame collage art with real-time effects, shuffle, individual tile painting, and export.',
  openGraph: {
    title: 'FrameMix Photo Grid Studio',
    description: 'An interactive photo grid filter studio inspired by generative split-frame collage art with real-time effects, shuffle, individual tile painting, and export.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FrameMix Photo Grid Studio',
    description: 'An interactive photo grid filter studio inspired by generative split-frame collage art with real-time effects, shuffle, individual tile painting, and export.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
