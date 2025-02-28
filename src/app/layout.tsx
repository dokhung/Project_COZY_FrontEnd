import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header/indext';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={pretendard.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
