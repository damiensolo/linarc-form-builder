import "./globals.css";
import { cn } from "@/lib/utils";
import { fontVariables } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Custom Forms",
    template: "%s | Custom Forms",
  },
  description: "Create responsive forms with a lightweight form builder.",
  keywords: ["form builder", "online forms", "form creator", "web forms", "form designer", "shadcn/ui", "react components", "react form builder"],
  authors: [{ name: "ID" }],
  creator: "ID",
  publisher: "Custom Forms",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
          metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://damiensolo.github.io/linarc-form-builder' : 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NODE_ENV === 'production' ? 'https://damiensolo.github.io/linarc-form-builder' : 'http://localhost:3000',
    siteName: "Custom Forms",
    title: "Custom Forms",
    description: "Create responsive forms with a lightweight form builder.",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={cn(fontVariables, "font-sans")}>
        <PostHogProvider>
          {children}
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
