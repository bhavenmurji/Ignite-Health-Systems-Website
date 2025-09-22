import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Ignite Health Systems - Revolutionizing Healthcare IT",
  description: "Transform your healthcare organization with our cutting-edge EHR system built on Next.js 15, designed for modern healthcare providers.",
  keywords: ["healthcare", "EHR", "electronic health records", "healthcare IT", "medical software", "healthcare technology"],
  authors: [{ name: "Ignite Health Systems" }],
  openGraph: {
    title: "Ignite Health Systems - Revolutionizing Healthcare IT",
    description: "Transform your healthcare organization with our cutting-edge EHR system built on Next.js 15",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ignite Health Systems - Revolutionizing Healthcare IT",
    description: "Transform your healthcare organization with our cutting-edge EHR system built on Next.js 15",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${GeistSans.className} antialiased bg-background text-foreground overflow-x-hidden w-full max-w-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}