import { createClient } from "@/lib/supabase/server"
import { getUserPosts } from "@/lib/posts-simple"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Eye, Edit } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const posts = await getUserPosts(user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">仪表板</h1>
          <p className="text-muted-foreground">管理您的博客文章</p>
        </div>

        <Button asChild>
          <Link href="/dashboard/posts/new">
            <PenTool className="mr-2 h-4 w-4" />
            写新文章
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">您还没有发布任何文章</p>
              <Button asChild>
                <Link href="/dashboard/posts/new">开始写作</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>创建于 {new Date(post.created_at).toLocaleDateString("zh-CN")}</CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "已发布" : "草稿"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {post.excerpt && <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>}

                <div className="flex items-center gap-2">
                  {post.published && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/posts/${post.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        查看
                      </Link>
                    </Button>
                  )}

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/posts/${post.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      编辑
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
