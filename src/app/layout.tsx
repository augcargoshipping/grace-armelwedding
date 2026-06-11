import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { COUPLE, GALLERY_IMAGES, OPENER_VIDEO, WEDDING, WEDDING_AUDIO, WEDDING_IMAGES } from "@/lib/constants";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

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
      <head>
        <link rel="preload" href={OPENER_VIDEO.poster} as="image" fetchPriority="high" />
        <link
          rel="preload"
          href={OPENER_VIDEO.src}
          as="video"
          type="video/mp4"
          fetchPriority="high"
        />
        <link rel="preload" href={WEDDING_IMAGES.hero} as="image" fetchPriority="high" />
        <link rel="preload" href={WEDDING_AUDIO.src} as="fetch" fetchPriority="high" />
        {GALLERY_IMAGES.slice(0, 8).map((image) => (
          <link key={image.src} rel="preload" href={image.src} as="image" fetchPriority="high" />
        ))}
      </head>
      <body className="m-0 min-h-screen p-0 antialiased">{children}</body>
    </html>
  );
}
