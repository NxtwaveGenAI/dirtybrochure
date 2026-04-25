import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIRTY BROCHURE — The Truth They Don't Print",
  description: "Exposing the lies in engineering college prospectuses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Special+Elite&family=Archivo+Black&family=JetBrains+Mono:wght@400;700&family=Anton&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="loading">
        {children}
      </body>
    </html>
  );
}
