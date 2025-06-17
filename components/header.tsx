import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import AuthButton from "./auth-button"

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          我的博客
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-primary">
            首页
          </Link>
          <Link href="/about" className="hover:text-primary">
            关于
          </Link>
          {user && (
            <Link href="/dashboard" className="hover:text-primary">
              仪表板
            </Link>
          )}
        </nav>

        <AuthButton user={user} />
      </div>
    </header>
  )
}
