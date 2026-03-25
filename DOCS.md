# Tàng Kiếm Frontend — Tài liệu nghiệp vụ & kỹ thuật

> **Last updated:** 2026-03-25
> **Stack:** Next.js 16 (App Router) + TypeScript + Vanilla CSS + Shadcn/UI
> **Backend API:** https://api.tangkiem.xyz/api/v1
> **Production:** https://tangkiem.xyz

---

## 1. Tổng quan kiến trúc

```
frondend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Trang chủ
│   │   ├── truyen/
│   │   │   ├── page.tsx        # Danh sách truyện (filter, grid/list toggle)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx    # Chi tiết truyện
│   │   │       └── [chapterSlug]/
│   │   │           └── page.tsx # Đọc chương
│   │   ├── the-loai/
│   │   │   ├── page.tsx        # Danh sách thể loại
│   │   │   └── [slug]/page.tsx # Truyện theo thể loại (grid/list toggle)
│   │   ├── bang-xep-hang/page.tsx  # Bảng xếp hạng
│   │   ├── tim-kiem/page.tsx       # Tìm kiếm
│   │   ├── layout.tsx          # Layout chung (Header + Footer + GA)
│   │   ├── globals.css         # CSS toàn cục + design system
│   │   ├── sitemap.ts          # Auto-generated /sitemap.xml
│   │   └── robots.ts           # Auto-generated /robots.txt
│   ├── components/
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx      # Navigation + Search bar
│   │   │   └── Footer.tsx      # Footer
│   │   ├── story/              # Story-related components
│   │   │   ├── CategoryStoryList.tsx  # Grid/list toggle cho /the-loai/[slug]
│   │   │   └── StoryListView.tsx      # Grid/list toggle cho /truyen
│   │   ├── ui/                 # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   └── card.tsx
│   │   ├── GoogleAnalytics.tsx  # GA4 script (env-driven)
│   │   └── theme-provider.tsx   # Dark/light theme
│   └── lib/
│       ├── api.ts              # API client (serverFetch + clientFetch)
│       ├── types.ts            # TypeScript interfaces
│       └── utils.ts            # Utility functions (cn, etc.)
├── .env.local                  # Env development (không push lên git)
├── .env.production             # Env production (không push lên git)
├── components.json             # Shadcn/UI config
├── next.config.ts              # Next.js config
├── postcss.config.mjs          # PostCSS config
└── package.json
```

---

## 2. Luồng xác thực API

### 2 loại key

| Key            | Header         | Dùng cho              | Bảo mật                                 |
| -------------- | -------------- | --------------------- | --------------------------------------- |
| **Secret Key** | `X-Secret-Key` | Server-side (SSR)     | Không expose ra browser                 |
| **Public Key** | `X-Public-Key` | Client-side (browser) | Expose ra browser, validate bằng domain |

### Cách hoạt động

```
Browser request → Next.js Server (SSR)
                      ↓
              serverFetch() → API (X-Secret-Key + X-Forwarded-User-Agent)
                      ↓
              Render HTML → Browser

Browser (client component) → clientFetch() → API (X-Public-Key + Origin header)
```

### User-Agent Forwarding (chống bot)

`serverFetch()` tự động forward `User-Agent` của browser thật qua header `X-Forwarded-User-Agent`.
Điều này giúp:
- Backend phân biệt được SSR request vs bot thật
- Cloudflare không block SSR requests
- View count được tính đúng cho người dùng thật

### Quản lý key

- Key được tạo trong **Backend Admin Panel** → API Domain
- Mỗi domain (localhost, tangkiem.xyz) cần 1 cặp key riêng
- **QUAN TRỌNG:** `NEXT_PUBLIC_*` được nhúng cứng lúc build → đổi key phải **build lại**

### Env variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.tangkiem.xyz/api/v1
API_SECRET_KEY=<secret_key>                    # Server-side only
NEXT_PUBLIC_API_PUBLIC_KEY=<public_key>         # Baked vào client JS lúc build
NEXT_PUBLIC_SITE_NAME=Tàng Kiếm
NEXT_PUBLIC_SITE_URL=https://tangkiem.xyz
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX                 # Google Analytics 4 Measurement ID
```

---

## 3. API Client (`src/lib/api.ts`)

### serverFetch(endpoint, options?)

- Dùng cho **Server Components** (SSR)
- Tự thêm `X-Secret-Key` header
- Tự forward `X-Forwarded-User-Agent` từ browser
- Có cache + revalidate 60s

### clientFetch(endpoint, options?)

- Dùng cho **Client Components** (`"use client"`)
- Tự thêm `X-Public-Key` header
- Không cache

### Các hàm API chính

| Hàm                             | Endpoint                                     | Mô tả                                         |
| ------------------------------- | -------------------------------------------- | --------------------------------------------- |
| `getStories(params)`            | `GET /stories`                               | Danh sách truyện (phân trang, filter)         |
| `getStory(slug)`                | `GET /stories/{slug}`                        | Chi tiết truyện                               |
| `getChapters(slug, params)`     | `GET /stories/{slug}/chapters`               | Danh sách chương                              |
| `getChapter(slug, chapterSlug)` | `GET /stories/{slug}/chapters/{chapterSlug}` | Nội dung chương                               |
| `getCategories()`               | `GET /categories`                            | Tất cả thể loại                               |
| `getCategoryStories(slug)`      | `GET /categories/{slug}`                     | Truyện theo thể loại                          |
| `getRankings(period)`           | `GET /rankings/{period}`                     | Bảng xếp hạng (daily/weekly/monthly/all-time) |
| `searchStories(params)`         | `GET /search`                                | Tìm kiếm truyện                               |
| `getReviews(storyId, params)`   | `GET /stories/{id}/reviews`                  | Đánh giá truyện                               |

---

## 4. Các trang và nghiệp vụ

### 4.1 Trang chủ (`/`)

- **Rendering:** SSR với revalidate 60s
- **Data:** Featured stories (8), latest stories (24), categories, daily rankings
- **Sections:** Banner → Truyện nổi bật → Mới cập nhật (table) → Rankings sidebar

### 4.2 Danh sách truyện (`/truyen`)

- **Rendering:** Dynamic SSR + Client-side view toggle
- **Filters:** `?category=slug&status=ongoing&sort=latest&page=2`
- **View Toggle:** Grid (mặc định) / List — pill-style toggle bar
- **Component:** `StoryListView` (client component)
- **Pagination:** Server-side, hiển thị tối đa 10 pages + last page
- **Sidebar:** Danh sách thể loại với số lượng

### 4.3 Chi tiết truyện (`/truyen/[slug]`)

- **Rendering:** Dynamic SSR
- **Data:** Story detail + chapters (50/page)
- **Hiển thị:** Cover, tác giả, thể loại, trạng thái, rating, chapters list
- **Action Buttons:** "Đọc từ đầu" + "Đọc mới nhất"
- **SEO:** Dynamic metadata từ API
- **Lưu ý:** `chapter_count` từ stories API có thể = 0 (bug backend) → dùng `chapterMeta.total` thay thế

### 4.4 Đọc chương (`/truyen/[slug]/[chapterSlug]`)

- **Rendering:** Dynamic SSR
- **Data:** Chapter content + prev/next navigation
- **Navigation:** Chương trước ← Mục lục → Chương sau
- **SEO:** Dynamic title từ chapter

### 4.5 Thể loại (`/the-loai`)

- **Rendering:** SSR với revalidate 60s
- **Data:** Tất cả categories với story_count

### 4.6 Thể loại chi tiết (`/the-loai/[slug]`)

- **Rendering:** Dynamic SSR + Client-side view toggle
- **Component:** `CategoryStoryList` (client component)
- **View Toggle:** Grid (mặc định) / List — pill-style toggle bar
- **Data:** Category info + stories trong thể loại
- **Sidebar:** Thể loại khác

### 4.7 Bảng xếp hạng (`/bang-xep-hang`)

- **Rendering:** CSR (`"use client"`)
- **Tabs:** Hôm nay / Tuần này / Tháng này / Mọi lúc
- **Dùng:** `clientFetch` → switch tab không reload page

### 4.8 Tìm kiếm (`/tim-kiem`)

- **Rendering:** Dynamic SSR
- **Query:** `?q=keyword&page=1`
- **Form:** Native HTML form submit (GET)

---

## 5. SEO & Analytics

### Google Analytics (GA4)

- **Component:** `src/components/GoogleAnalytics.tsx`
- **Config:** Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` trong `.env`
- **Load strategy:** `afterInteractive` — không block page render
- **Lưu ý:** GA ID được bake vào lúc build → thêm/đổi ID phải build lại

### Sitemap (`/sitemap.xml`)

- Auto-generated từ `src/app/sitemap.ts`
- Bao gồm tất cả trang tĩnh chính (trang chủ, danh sách, thể loại, bảng xếp hạng)
- Google tự phát hiện qua `/robots.txt`

### Robots (`/robots.txt`)

- Auto-generated từ `src/app/robots.ts`
- Allow tất cả crawlers, block `/api/` và `/_next/`
- Trỏ đến `/sitemap.xml`

### Open Graph & Twitter Cards

- Được set trong `layout.tsx` metadata (global defaults)
- Mỗi page có thể override qua `generateMetadata()`
- Hỗ trợ Facebook, Zalo, Twitter share preview

### Google Search Console

- Thêm verification code trong `layout.tsx` → `metadata.verification.google`

---

## 6. Known Issues & Workarounds

### chapter_count = 0 (Backend bug)

- **Vấn đề:** API `stories` endpoint trả `chapter_count: 0` cho tất cả truyện dù có chapters
- **Nguyên nhân:** Backend counter cache chưa sync
- **Workaround FE:**
  - Story card: ẩn badge "chương" khi `chapter_count = 0`
  - Story detail: dùng `chapterMeta.total` từ chapters endpoint
  - Khi backend fix → bỏ điều kiện check, hiển thị trực tiếp

### story_count trên categories

- Hầu hết categories có `story_count: 0` trừ Kiếm Hiệp (518)
- Đây là data thực, chờ thêm truyện vào các thể loại

### NEXT_PUBLIC env trên VPS

- File `.env.local` trên VPS có thể bị lỗi encoding → env không được đọc lúc build
- **Fix:** Truyền env inline khi build:
  ```bash
  NEXT_PUBLIC_GA_ID=G-LKDQ0F0777 npm run build
  ```

---

## 7. Deploy

### Production Stack

- **Server:** Nginx (FastPanel) → Reverse proxy → Next.js (PM2)
- **Path:** `/var/www/tangkiem_xyz_usr/data/www/tangkiem.xyz`
- **Port:** 3000
- **Process Manager:** PM2 (`tangkiem-frontend`)

### Quy trình deploy

```bash
# 1. Local: commit & push
git add . && git commit -m "description" && git push

# 2. Server: pull & build
cd /var/www/tangkiem_xyz_usr/data/www/tangkiem.xyz
git pull

# 3. Build (truyền NEXT_PUBLIC env inline nếu .env.local bị lỗi)
NEXT_PUBLIC_GA_ID=G-LKDQ0F0777 npm run build

# 4. Restart
pm2 restart tangkiem-frontend
```

### Lưu ý khi đổi NEXT_PUBLIC_* env

Phải **build lại** vì giá trị được embed vào JS bundle lúc build time.

### Kiểm tra build có đọc env đúng không

```bash
grep -r "G-LKDQ0F0777" .next/ | head -5
# Có kết quả = OK, không có = env chưa được bake
```

---

## 8. Phát triển thêm

### Thêm trang mới

1. Tạo file `src/app/<route>/page.tsx`
2. Server Component → dùng `serverFetch` / các hàm trong `api.ts`
3. Client Component → thêm `"use client"` ở đầu, dùng `clientFetch`
4. Export `metadata` cho SEO

### Thêm API endpoint mới

1. Thêm hàm trong `src/lib/api.ts`
2. Thêm interface trong `src/lib/types.ts`
3. Pattern:

```typescript
export async function getNewData(params?: Record<string, string>) {
  return serverFetch<{ data: NewType[] }>("/new-endpoint", params);
}
```

### Thêm component mới

1. Tạo trong `src/components/`
2. Shadcn/UI components: `npx shadcn@latest add <component>`
3. CSS dùng globals.css hoặc inline styles
4. Tái sử dụng các class CSS global

### CSS Classes có sẵn

| Class                                                           | Mô tả                          |
| --------------------------------------------------------------- | ------------------------------ |
| `.container`                                                    | Max-width wrapper              |
| `.card`, `.card--padded`                                        | Card component                 |
| `.story-card`                                                   | Story thumbnail card (grid)    |
| `.story-list-item`                                              | Story list row                 |
| `.badge`, `.badge--hot`, `.badge--ongoing`, `.badge--completed` | Status badges                  |
| `.section-title`                                                | Section header (gradient line) |
| `.pagination`                                                   | Pagination bar                 |
| `.reader`, `.reader__content`                                   | Chapter reader                 |
| `.reader__nav-btn`                                              | Reader navigation buttons      |
| `.view-toggle-bar`                                              | Grid/list toggle container     |
| `.filter-btn`, `.filter-btn--active`                            | Filter pills                   |
| `.sidebar-cat-link`                                             | Sidebar category links         |
| `.update-table`                                                 | Data table                     |
| `.empty-state`                                                  | Empty state placeholder        |
| `.category-grid`                                                | Categories grid                |
| `.chapter-list`                                                 | Chapters list                  |

---

## 9. Git Workflow

- **Repo FE:** https://github.com/Splinh/tangkiem-fe.git
- **Repo BE:** https://github.com/dungnq81/tangkiem-backend.git (chỉ pull, không push)
- **Branch:** `main`
- **Không push:** `.env.local`, `.env.production`, `node_modules/`, `.next/`, `*.zip`, `*.tar.gz`
