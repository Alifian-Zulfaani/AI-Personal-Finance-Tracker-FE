import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "FinTracker - AI Personal Finance Tracker",
  description: "Kelola keuangan pribadi Anda dengan bantuan AI. Pantau pemasukan, pengeluaran, dan dapatkan insight keuangan cerdas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-background antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
