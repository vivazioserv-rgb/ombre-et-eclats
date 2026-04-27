import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartProvider";
import CookieBanner from "@/components/CookieBanner";
import { siteConfig } from "@/site.config";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
};

const themeVars = `:root{
  --background:${siteConfig.theme.background};
  --foreground:${siteConfig.theme.foreground};
  --primary:${siteConfig.theme.primary};
  --primary-dark:${siteConfig.theme.primaryDark};
  --accent:${siteConfig.theme.accent};
  --muted:${siteConfig.theme.muted};
}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeVars }} />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
