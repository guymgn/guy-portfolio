import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://guymagen.com"),
  title: "Guy Magen | Senior Product Designer & Builder",
  description: "Guy Magen designs complex products and builds what comes next.",
  openGraph: {
    title: "Guy Magen | Senior Product Designer & Builder",
    description: "I design complex products and build what comes next.",
    type: "website",
    images: [{ url: "/og.png", width: 1792, height: 1024, alt: "Guy Magen, Senior Product Designer and Builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guy Magen | Senior Product Designer & Builder",
    description: "I design complex products and build what comes next.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
