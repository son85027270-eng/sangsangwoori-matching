import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "상상우리 — 시니어 일자리 매칭",
  description: "시니어와 일자리를 자동으로 매칭합니다",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <header className="bg-blue-700 text-white py-5 px-8 flex items-center justify-between shadow-md">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            상상우리
          </Link>
          <nav className="flex gap-8 text-lg font-semibold">
            <Link href="/register" className="hover:text-blue-200 transition-colors">
              프로필 등록
            </Link>
            <Link href="/recommendations" className="hover:text-blue-200 transition-colors">
              추천 일자리
            </Link>
            <Link href="/admin" className="hover:text-blue-200 transition-colors">
              담당자 대시보드
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-gray-500 text-base">
          © 2025 상상우리. 시니어 일자리 매칭 시스템.
        </footer>
      </body>
    </html>
  );
}
