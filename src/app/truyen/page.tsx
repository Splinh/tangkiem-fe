import Link from "next/link";
import { getStories, getCategories } from "@/lib/api";
import type { Metadata } from "next";
import StoryListView from "@/components/story/StoryListView";

export const metadata: Metadata = {
  title: "Danh sách truyện",
  description:
    "Danh sách truyện tiên hiệp, kiếm hiệp, huyền huyễn mới cập nhật tại Tàng Kiếm.",
};

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;

  const [storiesRes, categoriesRes] = await Promise.all([
    getStories({
      ...(sp.category && { category: sp.category }),
      ...(sp.status && { status: sp.status }),
      ...(sp.sort && { sort: sp.sort }),
      ...(sp.page && { page: sp.page }),
    }).catch(() => null),
    getCategories().catch(() => null),
  ]);

  const stories = storiesRes?.data || [];
  const categories = categoriesRes?.data || [];
  const meta = storiesRes?.meta;
  const currentPage = meta?.current_page || 1;
  const lastPage = meta?.last_page || 1;

  // Build base href preserving current filters
  const params = new URLSearchParams();
  if (sp.category) params.set("category", sp.category);
  if (sp.status) params.set("status", sp.status);
  if (sp.sort) params.set("sort", sp.sort);
  const baseHref = params.toString() ? `/truyen?${params.toString()}` : "/truyen";

  return (
    <div className="container">
      <div className="page-layout">
        <div className="page-layout__main">
          <h1 className="section-title">
            <span className="section-title__icon">📖</span>
            Danh Sách Truyện
            {meta && (
              <span className="section-title__link">{meta.total} truyện</span>
            )}
          </h1>

          {/* Filters */}
          <div className="card card--padded mb-24">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <span className="filter-label">Thể loại:</span>
              <Link
                href="/truyen"
                className={`filter-btn ${!sp.category ? "filter-btn--active" : ""}`}
              >
                Tất cả
              </Link>
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/truyen?category=${cat.slug}`}
                  className={`filter-btn ${sp.category === cat.slug ? "filter-btn--active" : ""}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <span className="filter-label">Trạng thái:</span>
              {[
                { key: "", label: "Tất cả" },
                { key: "ongoing", label: "Đang ra" },
                { key: "completed", label: "Hoàn thành" },
                { key: "paused", label: "Tạm dừng" },
              ].map((item) => (
                <Link
                  key={item.key}
                  href={`/truyen?${item.key ? `status=${item.key}` : ""}${sp.category ? `&category=${sp.category}` : ""}`}
                  className={`filter-btn ${(sp.status || "") === item.key ? "filter-btn--active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Story Grid/List with Toggle */}
          <StoryListView
            stories={stories}
            currentPage={currentPage}
            lastPage={lastPage}
            baseHref={baseHref}
          />
        </div>

        {/* Sidebar */}
        <aside className="page-layout__sidebar">
          <div className="card card--padded">
            <h3 className="section-title">
              <span className="section-title__icon">📚</span>
              Thể Loại
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/the-loai/${cat.slug}`}
                  className="sidebar-cat-link"
                >
                  <span>{cat.name}</span>
                  <span className="sidebar-cat-link__count">
                    {cat.story_count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
