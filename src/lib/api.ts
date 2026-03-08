// ════════════════════════════════════════════════════════════
// Tàng Kiếm — API Client
// ════════════════════════════════════════════════════════════

import type {
  Story,
  Chapter,
  ChapterContent,
  Category,
  ApiResponse,
  Review,
  ReviewMeta,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://tangkiem-backend.test/api/v1";
const SECRET_KEY = process.env.API_SECRET_KEY || "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_API_PUBLIC_KEY || "";

// ─── Server-side fetch (SSR) ───
async function serverFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (SECRET_KEY) {
    headers["X-Secret-Key"] = SECRET_KEY;
  }

  try {
    const res = await fetch(url.toString(), {
      headers,
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    });

    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`[API] Failed to fetch ${path}:`, error);
    throw error;
  }
}

// ─── Client-side fetch ───
export async function clientFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (PUBLIC_KEY) {
    headers["X-Public-Key"] = PUBLIC_KEY;
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  return res.json();
}

// ════════════════════════════════════════════════════════════
// Public API Functions
// ════════════════════════════════════════════════════════════

export async function getStories(
  params?: Record<string, string>,
): Promise<ApiResponse<Story[]>> {
  return serverFetch<ApiResponse<Story[]>>("/stories", params);
}

export async function getStory(slug: string): Promise<{ data: Story }> {
  return serverFetch<{ data: Story }>(`/stories/${slug}`);
}

export async function getChapters(
  storySlug: string,
  params?: Record<string, string>,
): Promise<ApiResponse<Chapter[]>> {
  return serverFetch<ApiResponse<Chapter[]>>(
    `/stories/${storySlug}/chapters`,
    params,
  );
}

export async function getChapter(
  storySlug: string,
  chapterSlug: string,
): Promise<{ data: ChapterContent }> {
  return serverFetch<{ data: ChapterContent }>(
    `/stories/${storySlug}/chapters/${chapterSlug}`,
  );
}

export async function getCategories(
  params?: Record<string, string>,
): Promise<{ data: Category[] }> {
  return serverFetch<{ data: Category[] }>("/categories", params);
}

export async function getCategoryStories(
  slug: string,
  params?: Record<string, string>,
) {
  return serverFetch<{ data: Category; stories: ApiResponse<Story[]> }>(
    `/categories/${slug}`,
    params,
  );
}

export async function getRankings(
  period: string,
  params?: Record<string, string>,
): Promise<ApiResponse<Story[]>> {
  return serverFetch<ApiResponse<Story[]>>(`/rankings/${period}`, params);
}

export async function searchStories(
  params: Record<string, string>,
): Promise<ApiResponse<Story[]>> {
  return serverFetch<ApiResponse<Story[]>>("/search", params);
}

export async function getReviews(
  storyId: number,
  params?: Record<string, string>,
): Promise<ApiResponse<Review[]> & { meta: ReviewMeta }> {
  return serverFetch(`/stories/${storyId}/reviews`, params);
}

// ════════════════════════════════════════════════════════════
// Mock Data (used when API is unavailable)
// ════════════════════════════════════════════════════════════

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Tiên Hiệp", slug: "tien-hiep", story_count: 450 },
  { id: 2, name: "Kiếm Hiệp", slug: "kiem-hiep", story_count: 320 },
  { id: 3, name: "Huyền Huyễn", slug: "huyen-huyen", story_count: 280 },
  { id: 4, name: "Đô Thị", slug: "do-thi", story_count: 510 },
  { id: 5, name: "Khoa Huyễn", slug: "khoa-huyen", story_count: 150 },
  { id: 6, name: "Kỳ Huyễn", slug: "ky-huyen", story_count: 200 },
  { id: 7, name: "Lịch Sử", slug: "lich-su", story_count: 180 },
  { id: 8, name: "Hệ Thống", slug: "he-thong", story_count: 350 },
  { id: 9, name: "Ngôn Tình", slug: "ngon-tinh", story_count: 620 },
  { id: 10, name: "Trọng Sinh", slug: "trong-sinh", story_count: 290 },
  { id: 11, name: "Xuyên Không", slug: "xuyen-khong", story_count: 410 },
  { id: 12, name: "Quân Sự", slug: "quan-su", story_count: 95 },
];

export const MOCK_STORIES: Story[] = [
  {
    id: 1,
    title: "Đấu Phá Thương Khung",
    slug: "dau-pha-thuong-khung",
    alternative_titles: "Battle Through the Heavens",
    description:
      "Giữa trời đất, đấu khí nên tôn. Không có hoa lệ ma pháp, không có phong hoa tuyết nguyệt, chỉ có đấu khí phồn hoa!",
    status: "completed",
    status_label: "Hoàn thành",
    origin: "china",
    origin_label: "Trung Quốc",
    origin_flag: "🇨🇳",
    is_featured: true,
    is_hot: true,
    is_vip: false,
    view_count: 1250000,
    chapter_count: 1648,
    rating_avg: 4.5,
    rating_count: 3200,
    author: {
      id: 1,
      name: "Thiên Tàm Thổ Đậu",
      slug: "thien-tam-tho-dau",
      story_count: 5,
    },
    primary_category: {
      id: 1,
      name: "Tiên Hiệp",
      slug: "tien-hiep",
      story_count: 450,
    },
    published_at: "2025-01-15T08:00:00+07:00",
    last_chapter_at: "2025-12-01T10:30:00+07:00",
    updated_at: "2025-12-01T10:30:00+07:00",
  },
  {
    id: 2,
    title: "Nguyên Tôn",
    slug: "nguyen-ton",
    description:
      "Thiên địa sơ khai, chư Thánh lâm thế, hỗn chiến bát phương, nhưng lại tạo nên một giọt Tổ Long chi huyết...",
    status: "completed",
    status_label: "Hoàn thành",
    origin: "china",
    origin_label: "Trung Quốc",
    origin_flag: "🇨🇳",
    is_featured: true,
    is_hot: false,
    is_vip: false,
    view_count: 980000,
    chapter_count: 1510,
    rating_avg: 4.3,
    rating_count: 2100,
    author: {
      id: 1,
      name: "Thiên Tàm Thổ Đậu",
      slug: "thien-tam-tho-dau",
      story_count: 5,
    },
    primary_category: {
      id: 1,
      name: "Tiên Hiệp",
      slug: "tien-hiep",
      story_count: 450,
    },
    published_at: "2025-02-10T08:00:00+07:00",
    last_chapter_at: "2025-11-20T10:30:00+07:00",
    updated_at: "2025-11-20T10:30:00+07:00",
  },
  {
    id: 3,
    title: "Vũ Động Càn Khôn",
    slug: "vu-dong-can-khon",
    description:
      "Tu luyện chỉ đạo, ở nơi gian nan khốc liệt, cường giả vi tôn...",
    status: "completed",
    status_label: "Hoàn thành",
    origin: "china",
    origin_label: "Trung Quốc",
    origin_flag: "🇨🇳",
    is_featured: false,
    is_hot: true,
    is_vip: false,
    view_count: 850000,
    chapter_count: 1315,
    rating_avg: 4.2,
    rating_count: 1800,
    author: {
      id: 1,
      name: "Thiên Tàm Thổ Đậu",
      slug: "thien-tam-tho-dau",
      story_count: 5,
    },
    primary_category: {
      id: 3,
      name: "Huyền Huyễn",
      slug: "huyen-huyen",
      story_count: 280,
    },
    published_at: "2025-03-01T08:00:00+07:00",
    last_chapter_at: "2025-10-15T10:30:00+07:00",
    updated_at: "2025-10-15T10:30:00+07:00",
  },
  {
    id: 4,
    title: "Đại Chúa Tể",
    slug: "dai-chu-te",
    description:
      "Đại Thiên Thế Giới, vạn tộc lâm lập, vô số cường giả như lâm, bậc chí cường giả có thể nắm giữ sao trời...",
    status: "completed",
    status_label: "Hoàn thành",
    origin: "china",
    origin_label: "Trung Quốc",
    origin_flag: "🇨🇳",
    is_featured: true,
    is_hot: false,
    is_vip: false,
    view_count: 720000,
    chapter_count: 1562,
    rating_avg: 4.4,
    rating_count: 1500,
    author: {
      id: 1,
      name: "Thiên Tàm Thổ Đậu",
      slug: "thien-tam-tho-dau",
      story_count: 5,
    },
    primary_category: {
      id: 3,
      name: "Huyền Huyễn",
      slug: "huyen-huyen",
      story_count: 280,
    },
    published_at: "2025-04-10T08:00:00+07:00",
    last_chapter_at: "2025-09-20T10:30:00+07:00",
    updated_at: "2025-09-20T10:30:00+07:00",
  },
  {
    id: 5,
    title: "Phàm Nhân Tu Tiên",
    slug: "pham-nhan-tu-tien",
    description:
      "Một thiếu niên bình thường nhưng kiên định, từng bước từng bước đi trên con đường tiên đạo...",
    status: "ongoing",
    status_label: "Đang ra",
    origin: "china",
    origin_label: "Trung Quốc",
    origin_flag: "🇨🇳",
    is_featured: false,
    is_hot: true,
    is_vip: false,
    view_count: 2100000,
    chapter_count: 2446,
    rating_avg: 4.8,
    rating_count: 5200,
    author: { id: 2, name: "Vong Ngữ", slug: "vong-ngu", story_count: 3 },
    primary_category: {
      id: 1,
      name: "Tiên Hiệp",
      slug: "tien-hiep",
      story_count: 450,
    },
    published_at: "2024-06-01T08:00:00+07:00",
    last_chapter_at: "2026-02-25T10:30:00+07:00",
    updated_at: "2026-02-25T10:30:00+07:00",
  },
  {
    id: 6,
    title: "Già Thiên",
    slug: "gia-thien",
    description:
      "Một bên là vĩnh hằng, một bên là hủy diệt, cuối cùng chọn con đường nào?",
    status: "ongoing",
    status_label: "Đang ra",
    origin: "china",
    origin_label: "Trung Quốc",
    origin_flag: "🇨🇳",
    is_featured: false,
    is_hot: false,
    is_vip: false,
    view_count: 560000,
    chapter_count: 890,
    rating_avg: 4.1,
    rating_count: 900,
    author: { id: 3, name: "Thần Tiêu", slug: "than-tieu", story_count: 2 },
    primary_category: {
      id: 1,
      name: "Tiên Hiệp",
      slug: "tien-hiep",
      story_count: 450,
    },
    published_at: "2025-05-01T08:00:00+07:00",
    last_chapter_at: "2026-02-20T10:30:00+07:00",
    updated_at: "2026-02-20T10:30:00+07:00",
  },
  {
    id: 7,
    title: "Linh Vực",
    slug: "linh-vu",
    description:
      "Đại Lục Huyền Hoàng, mạnh giả vi tôn, nơi đây bước chân không thể lùi lại...",
    status: "completed",
    status_label: "Hoàn thành",
    origin: "china",
    origin_label: "Trung Quốc",
    origin_flag: "🇨🇳",
    is_featured: false,
    is_hot: false,
    is_vip: false,
    view_count: 430000,
    chapter_count: 1120,
    rating_avg: 4.0,
    rating_count: 780,
    author: {
      id: 4,
      name: "Nghịch Thương Thiên",
      slug: "nghich-thuong-thien",
      story_count: 4,
    },
    primary_category: {
      id: 3,
      name: "Huyền Huyễn",
      slug: "huyen-huyen",
      story_count: 280,
    },
    published_at: "2025-01-20T08:00:00+07:00",
    last_chapter_at: "2025-08-05T10:30:00+07:00",
    updated_at: "2025-08-05T10:30:00+07:00",
  },
  {
    id: 8,
    title: "Toàn Chức Pháp Sư",
    slug: "toan-chuc-phap-su",
    description:
      "Một thế giới song song hiện đại với hệ thống ma pháp thay thế khoa học...",
    status: "ongoing",
    status_label: "Đang ra",
    origin: "china",
    origin_label: "Trung Quốc",
    origin_flag: "🇨🇳",
    is_featured: true,
    is_hot: false,
    is_vip: false,
    view_count: 1800000,
    chapter_count: 3100,
    rating_avg: 4.6,
    rating_count: 4100,
    author: { id: 5, name: "Loạn", slug: "loan", story_count: 1 },
    primary_category: {
      id: 6,
      name: "Kỳ Huyễn",
      slug: "ky-huyen",
      story_count: 200,
    },
    published_at: "2024-01-01T08:00:00+07:00",
    last_chapter_at: "2026-02-24T10:30:00+07:00",
    updated_at: "2026-02-24T10:30:00+07:00",
  },
];

export const MOCK_CHAPTERS: Chapter[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  chapter_number: i + 1,
  title: `Chương ${i + 1}`,
  slug: `chuong-${i + 1}`,
  formatted_number: `Chương ${i + 1}`,
  full_title: `Chương ${i + 1}: Tiêu đề chương ${i + 1}`,
  word_count: 2500 + Math.floor(Math.random() * 2000),
  view_count: Math.floor(Math.random() * 10000),
  is_vip: false,
  is_free: true,
  published_at: new Date(2025, 0, i + 1).toISOString(),
}));
