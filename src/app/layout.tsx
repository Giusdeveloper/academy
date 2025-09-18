import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientNavbar from "@/components/ClientNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academy - Piattaforma Corsi Online",
  description: "La tua piattaforma per l'apprendimento online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <ClientNavbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
