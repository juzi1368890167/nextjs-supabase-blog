export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  published: boolean
  author_id: string
  created_at: string
  updated_at: string
  profiles?: Profile
  categories?: Category[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}
