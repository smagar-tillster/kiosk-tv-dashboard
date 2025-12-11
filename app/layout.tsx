import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./assets/globals.css";
import { DASHBOARD_CONFIG } from "./config/tenant-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tillster TV Dashboard",
  description: "Proactive monitoring dashboard for BK-US & PLK-US",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = DASHBOARD_CONFIG.defaultTheme;
  
  return (
    <html lang="en" className={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
