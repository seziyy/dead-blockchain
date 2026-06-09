import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

const displayFont = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-display"
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Dead Blockchain Theory",
  description:
    "Track estimated bot activity across blockchains with Dune-ready analytics.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Crect x='18' y='30' width='64' height='46' rx='10' stroke='%23050505' stroke-width='8'/%3E%3Cpath d='M50 30V15H35' stroke='%23050505' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M12 53H18M82 53H88' stroke='%23050505' stroke-width='8' stroke-linecap='round'/%3E%3Cpath d='M39 50V60M61 50V60' stroke='%23050505' stroke-width='8' stroke-linecap='round'/%3E%3C/svg%3E"
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <div className="relative min-h-screen overflow-x-hidden bg-app-bg">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
