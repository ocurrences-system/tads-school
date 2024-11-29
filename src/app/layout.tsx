import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider"; // Importar o ClientProvider
import { Toaster } from "sonner"; // Importar o Toaster do Sonner

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "tads-school",
  description: "Sistema Escolar TADS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider> {/* Envolver o layout com o ClientProvider */}
          <Toaster position="bottom-center" />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
