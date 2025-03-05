import Link from "next/link"
import { Film } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-6 w-6" />
              <span className="font-bold text-xl">MovieRecs</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Discover and save your favorite movies
            </p>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Navigation</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
                <Link href="/movies" className="text-sm text-muted-foreground hover:text-primary">
                  Movies
                </Link>
                <Link href="/favorites" className="text-sm text-muted-foreground hover:text-primary">
                  Favorites
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Account</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
                  Login
                </Link>
                <Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-primary">
                  Sign Up
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MovieRecs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

