import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/ui/Navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zaman AI Assistant - Исламский Банкинг",
  description: "Ваш персональный AI-помощник для управления финансами",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
