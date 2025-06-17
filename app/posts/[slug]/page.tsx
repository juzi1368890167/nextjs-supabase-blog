import { notFound } from "next/navigation"
import Image from "next/image"
import { getPostBySlug } from "@/lib/posts-simple"
import { Calendar, User } from "lucide-react"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {post.featured_image && (
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image src={post.featured_image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.created_at).toLocaleDateString("zh-CN")}</span>
          </div>

          {post.profiles && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.profiles.full_name || "匿名用户"}</span>
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br>") }} />
      </div>
    </article>
  )
}
