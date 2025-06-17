import { createClient } from "@/lib/supabase/server"
import type { Post } from "@/lib/types"

export async function getPosts(published = true): Promise<Post[]> {
  const supabase = await createClient()

  let query = supabase
    .from("posts")
    .select(`
      *,
      profiles!posts_author_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })

  if (published) {
    query = query.eq("published", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return data || []
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles!posts_author_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return data
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles!posts_author_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("author_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user posts:", error)
    return []
  }

  return data || []
}

// 获取分类的函数
export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

// 获取文章的分类
export async function getPostCategories(postId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("post_categories")
    .select(`
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("post_id", postId)

  if (error) {
    console.error("Error fetching post categories:", error)
    return []
  }

  return data?.map((item) => item.categories).filter(Boolean) || []
}
