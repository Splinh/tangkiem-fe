// ════════════════════════════════════════════════════════════
// Tàng Kiếm — TypeScript Types (matching API schemas)
// ════════════════════════════════════════════════════════════

export interface Author {
  id: number;
  name: string;
  slug: string;
  story_count: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  story_count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface CoverImage {
  url: string;
  alt: string;
}

export interface Story {
  id: number;
  title: string;
  slug: string;
  alternative_titles?: string;
  description?: string;
  content?: string; // HTML, only in detail
  status: "ongoing" | "completed" | "paused";
  status_label: string;
  origin: "china" | "korea" | "japan" | "vietnam";
  origin_label: string;
  origin_flag: string;
  is_featured: boolean;
  is_hot: boolean;
  is_vip: boolean;
  view_count: number;
  chapter_count: number;
  rating_avg: number;
  rating_count: number;
  author?: Author;
  primary_category?: Category;
  categories?: Category[];
  tags?: Tag[];
  chapters?: Chapter[];
  cover_image?: CoverImage;
  meta?: SEOMeta;
  published_at: string;
  last_chapter_at: string;
  updated_at: string;
}

export interface Chapter {
  id: number;
  chapter_number: number;
  sub_chapter?: string;
  volume_number?: number;
  title: string;
  slug: string;
  formatted_number: string;
  full_title: string;
  word_count: number;
  view_count?: number;
  is_vip: boolean;
  is_free: boolean;
  published_at: string;
}

export interface ChapterContent extends Chapter {
  content: string; // HTML
  prev_chapter?: { id: number; slug: string; formatted_number: string };
  next_chapter?: { id: number; slug: string; formatted_number: string };
  story: { id: number; title: string; slug: string };
  meta?: { title: string; description: string };
}

export interface Review {
  id: number;
  rating: number;
  review: string;
  is_featured: boolean;
  user: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  is_vip: boolean;
  is_author: boolean;
  bookmark_count: number;
  history_count: number;
  email_verified_at?: string;
  last_active_at?: string;
  created_at: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords?: string;
  canonical_url?: string;
}

// API Response types
export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: Record<string, string>;
}

export interface RankingMeta {
  period: string;
  limit: number;
}

export interface ReviewMeta extends PaginationMeta {
  average_rating: number;
  rating_count: number;
}
