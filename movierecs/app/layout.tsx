import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { FavoritesProvider } from "@/context/favorites-context"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MovieMate - Find Your Next Favorite Film",
  description: "Discover trending and personalized movie recommendations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <FavoritesProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                <div className="container">© {new Date().getFullYear()} MovieMate. All rights reserved.</div>
              </footer>
            </div>
            <Toaster />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'