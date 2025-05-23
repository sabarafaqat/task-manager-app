import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import ClientProviderWrapper from "../components/ClientProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pro Manage",
  description: "A responsive Kanban board with task management features",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviderWrapper>{children}</ClientProviderWrapper>
      </body>
    </html>
  );
}
