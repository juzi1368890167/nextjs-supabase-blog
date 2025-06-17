import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {post.featured_image && (
        <div className="relative h-48 w-full">
          <Image src={post.featured_image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(post.created_at).toLocaleDateString("zh-CN")}</span>
          {post.profiles && (
            <>
              <User className="h-4 w-4 ml-2" />
              <span>{post.profiles.full_name || "匿名用户"}</span>
            </>
          )}
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-xl font-semibold hover:text-primary transition-colors">{post.title}</h2>
        </Link>
      </CardHeader>

      <CardContent>{post.excerpt && <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>}</CardContent>
    </Card>
  )
}
