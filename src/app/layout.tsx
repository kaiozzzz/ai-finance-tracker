import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Finance Tracker", template: "%s — Finance Tracker" },
  description: "Controle financeiro pessoal com insights de IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className="bg-surface text-text-primary antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "hsl(220 13% 11%)",
              color: "hsl(0 0% 96%)",
              border: "1px solid hsl(220 13% 20%)",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
