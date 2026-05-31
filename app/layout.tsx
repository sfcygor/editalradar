import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EditalRadar",
    template: "%s | EditalRadar",
  },
  description:
    "Plataforma de estudos para concursos militares e policiais focada em desempenho, retenção, organização e aprovação.",
  keywords: [
    "concursos militares",
    "PM",
    "Bombeiro",
    "ESA",
    "EsPCEx",
    "PF",
    "estudo",
    "questões",
    "flashcards",
    "edital",
  ],
  authors: [{ name: "EditalRadar" }],
  creator: "EditalRadar",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "EditalRadar",
    description:
      "Plataforma de estudos para concursos militares e policiais focada em desempenho, retenção, organização e aprovação.",
    siteName: "EditalRadar",
  },
  twitter: {
    card: "summary_large_image",
    title: "EditalRadar",
    description:
      "Plataforma de estudos para concursos militares e policiais focada em desempenho, retenção, organização e aprovação.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
