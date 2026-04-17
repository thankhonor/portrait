import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { RiskLabelCombinationProvider } from "@/components/shared/risk-label-combination-manager"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI引擎运营平台",
  description: "AI Engine Operations Platform - Threat Intelligence Management System",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <RiskLabelCombinationProvider>{children}</RiskLabelCombinationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
