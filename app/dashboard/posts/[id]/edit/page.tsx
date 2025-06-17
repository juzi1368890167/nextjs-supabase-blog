"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [postId, setPostId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [postLoading, setPostLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadPost = async () => {
      const resolvedParams = await params
      setPostId(resolvedParams.id)

      const { data: post, error } = await supabase.from("posts").select("*").eq("id", resolvedParams.id).single()

      if (error || !post) {
        setMessage("文章不存在或无权限访问")
        return
      }

      // 检查是否是文章作者
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || user.id !== post.author_id) {
        setMessage("无权限编辑此文章")
        return
      }

      setTitle(post.title)
      setSlug(post.slug)
      setContent(post.content)
      setExcerpt(post.excerpt || "")
      setPublished(post.published)
      setPostLoading(false)
    }

    loadPost()
  }, [params, supabase])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        slug,
        content,
        excerpt,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("文章更新成功！")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    }

    setLoading(false)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    setMessage("")

    const { error } = await supabase.from("posts").delete().eq("id", postId)

    if (error) {
      setMessage(error.message)
      setDeleteLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  if (postLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (message && !title) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <p className="text-red-600">{message}</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">返回仪表板</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回仪表板
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleteLoading}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除文章
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>此操作无法撤销。这将永久删除您的文章。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? "删除中..." : "确认删除"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>编辑文章</CardTitle>
          <CardDescription>修改文章信息并保存</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="输入文章标题"
              />
            </div>

            <div>
              <Label htmlFor="slug">URL 别名</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="url-slug" />
              <p className="text-sm text-muted-foreground mt-1">修改 URL 别名可能会影响已分享的链接</p>
            </div>

            <div>
              <Label htmlFor="excerpt">摘要</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="文章摘要（可选）"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="在这里写下你的文章内容..."
                rows={15}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="published">发布文章</Label>
            </div>

            {message && (
              <p className={`text-sm ${message.includes("成功") ? "text-green-600" : "text-red-600"}`}>{message}</p>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "保存中..." : "保存更改"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
