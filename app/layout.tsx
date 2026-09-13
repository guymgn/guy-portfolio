import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "./Analytics";

const siteDescription = "Senior Product Designer & Builder with 12+ years designing complex B2B, SaaS, fintech, and AI-driven products.";
const socialImageAlt = "Guy Magen, Senior Product Designer and Builder";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.guymagen.com"),
  title: {
    default: "Guy Magen | Senior Product Designer & Builder",
    template: "%s | Guy Magen",
  },
  description: siteDescription,
  applicationName: "Guy Magen Portfolio",
  authors: [{ name: "Guy Magen", url: "https://www.guymagen.com" }],
  creator: "Guy Magen",
  publisher: "Guy Magen",
  category: "Portfolio",
  keywords: ["Guy Magen", "Senior Product Designer", "Product Design", "UX Design", "B2B SaaS", "AI Product Design", "Design Systems"],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Guy Magen | Senior Product Designer & Builder",
    description: siteDescription,
    type: "website",
    url: "/",
    siteName: "Guy Magen Portfolio",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, type: "image/png", alt: socialImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guy Magen | Senior Product Designer & Builder",
    description: siteDescription,
    images: [{ url: "/og.png", alt: socialImageAlt }],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})();` }} />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
