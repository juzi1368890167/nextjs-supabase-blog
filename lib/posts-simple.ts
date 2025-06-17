import { createClient } from "@/lib/supabase/server"
import type { Post } from "@/lib/types"

export async function getPosts(published = true): Promise<Post[]> {
  const supabase = await createClient()

  let query = supabase.from("posts").select("*").order("created_at", { ascending: false })

  if (published) {
    query = query.eq("published", true)
  }

  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  if (!posts) return []

  // 获取作者信息
  const authorIds = [...new Set(posts.map((post) => post.author_id))]
  const { data: profiles } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", authorIds)

  // 合并数据
  const postsWithAuthors = posts.map((post) => ({
    ...post,
    profiles: profiles?.find((profile) => profile.id === post.author_id) || null,
  }))

  return postsWithAuthors
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient()

  const { data: post, error } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  if (!post) return null

  // 获取作者信息
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", post.author_id)
    .single()

  return {
    ...post,
    profiles: profile || null,
  }
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user posts:", error)
    return []
  }

  if (!posts) return []

  // 获取作者信息
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", userId)
    .single()

  return posts.map((post) => ({
    ...post,
    profiles: profile || null,
  }))
}
