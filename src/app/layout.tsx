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
      <body className={`${pretendard.className} pt-16`}>
      {/* ✅ 고정된 헤더 */}
      <Header />
      {/* ✅ 헤더 밑으로 밀려 내려가는 본문 */}
      {children}
      </body>
      </html>
  );
}
