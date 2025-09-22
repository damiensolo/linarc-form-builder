import "./globals.css";
import { cn } from "@/lib/utils";
import { fontVariables } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Form Builder - Create Beautiful Forms",
    template: "%s | Form Builder",
  },
  description: "Create beautiful, responsive forms with our lightweight form builder and generate React code using shadcn/ui components.",
  keywords: ["form builder", "online forms", "form creator", "web forms", "form designer", "shadcn/ui", "react components", "react form builder"],
  authors: [{ name: "Igor Duspara" }],
  creator: "Igor Duspara",
  publisher: "Form Builder",
  icons: {
    icon: [
      { url: "/favicon.ico" },
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
  metadataBase: new URL('https://www.form-builder.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.form-builder.com",
    siteName: "Form Builder",
    title: "Form Builder - Create Beautiful Forms",
    description: "Create beautiful, responsive forms with our lightweight form builder and generate React code using shadcn/ui components.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Form Builder Preview",
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
