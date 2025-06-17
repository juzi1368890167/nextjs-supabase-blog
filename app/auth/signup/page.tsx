"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Github, Mail } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createClient()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("注册成功！请检查您的邮箱以验证账户。")
    }

    setLoading(false)
  }

  const handleGithubSignUp = async () => {
    setGithubLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(error.message)
      setGithubLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>注册</CardTitle>
          <CardDescription>创建一个新账户开始写博客</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GitHub 注册 */}
          <Button onClick={handleGithubSignUp} disabled={githubLoading} variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            {githubLoading ? "连接中..." : "使用 GitHub 注册"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">或者</span>
            </div>
          </div>

          {/* 邮箱注册 */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <Label htmlFor="fullName">姓名</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="您的姓名"
              />
            </div>

            <div>
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="至少6位密码"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes("成功") ? "text-green-600" : "text-red-600"}`}>{message}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              <Mail className="mr-2 h-4 w-4" />
              {loading ? "注册中..." : "邮箱注册"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              已有账户？{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                登录
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
