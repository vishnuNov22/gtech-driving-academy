import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["600", "700", "800"], display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "G-TECH Motor Driving School · Vellarada, Trivandrum",
  description:
    "Two-wheeler and four-wheeler driving training in Choondickal, Vellarada. 5 star safety rated dual control vehicles, door to door service 7 days a week, RTO procedures support. Join #DriveWithGtech.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "G-TECH Motor Driving School",
    description: "Learn to drive. Drive with confidence. Join #DriveWithGtech and start your journey today!",
    images: ["/brand/poster-banner.png"],
  },
};

export const viewport: Viewport = { themeColor: "#D2090F", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DrivingSchool",
  name: "G-TECH Motor Driving School",
  telephone: "+918075732441",
  email: "sathi7474@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Choondickal, Vellarada", addressRegion: "Kerala", postalCode: "695505", addressCountry: "IN" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="overflow-x-hidden">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
