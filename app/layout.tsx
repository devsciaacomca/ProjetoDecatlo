import type { Metadata } from "next";

import Providers from "@/components/Providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Decatlo",
  description: "Sistema de gerenciamento e apresentação do Decatlo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
