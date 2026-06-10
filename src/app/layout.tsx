import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { COUPLE, WEDDING } from "@/lib/constants";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${COUPLE.full} | Invitation de Mariage`,
  description: `${COUPLE.full} — ${WEDDING.dateLong}. Invitation de mariage civil en France.`,
  openGraph: {
    title: `${COUPLE.full} | Mariage ${WEDDING.dateDisplay}`,
    description: `Vous êtes invités à célébrer l'union de ${COUPLE.full}.`,
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${cormorant.variable} ${playfair.variable} ${inter.variable}`}
    >
      <body className="m-0 min-h-screen p-0 antialiased">{children}</body>
    </html>
  );
}
