"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 border-b">
      <Link href="/" className="font-semibold">
        Links
      </Link>

      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>

        <Button asChild>
          <Link href="/signup">Signup</Link>
        </Button>
      </div>
    </nav>
  )
}