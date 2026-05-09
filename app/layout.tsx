import type { Metadata, Viewport } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "kanribu-ai",
  description: "業務データを、AI に届ける。マルチテナント業務アプリケーション",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1f4e79" },
    { media: "(prefers-color-scheme: dark)", color: "#1f4e79" },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning className="bg-background">
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
