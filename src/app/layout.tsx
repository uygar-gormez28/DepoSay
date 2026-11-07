import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Şişe Takip | DOA Depozito İade Takibi",
  description: "DOA depozito iade sistemi için marka bazlı şişe takip ve günlük 200 adet kota yönetim uygulaması.",
  applicationName: "Şişe Takip",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#101827",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="antialiased selection:bg-white selection:text-[#101827] bg-[#101827] text-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
