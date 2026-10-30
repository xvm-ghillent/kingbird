import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Kingbird — Bring Something Worth Talking About",
  description:
    "An American aperitif. A few good stories. Meet Kingbird, the dry and tropical bottle made for your next great gathering.",
  robots: { index: false, follow: false },
  icons: { icon: "/assets/crown.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1eddf",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
