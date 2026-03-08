import Link from "next/link";
import { getStories, getCategories } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh sách truyện",
  description:
    "Danh sách truyện tiên hiệp, kiếm hiệp, huyền huyễn mới cập nhật tại Tàng Kiếm.",
};

function formatViews(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K";
  return count.toString();
}

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
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: "#666" }}
              >
                Thể loại:
              </span>
              <Link
                href="/truyen"
                className="badge badge--ongoing"
                style={{ textDecoration: "none" }}
              >
                Tất cả
              </Link>
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/truyen?category=${cat.slug}`}
                  style={{
                    padding: "3px 10px",
                    fontSize: "12px",
                    borderRadius: "3px",
                    border: "1px solid #e0e0e0",
                    color: sp.category === cat.slug ? "#fff" : "#555",
                    background: sp.category === cat.slug ? "#2980b9" : "white",
                    fontWeight: 500,
                  }}
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
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: "#666" }}
              >
                Trạng thái:
              </span>
              {[
                { key: "", label: "Tất cả" },
                { key: "ongoing", label: "Đang ra" },
                { key: "completed", label: "Hoàn thành" },
                { key: "paused", label: "Tạm dừng" },
              ].map((item) => (
                <Link
                  key={item.key}
                  href={`/truyen?${item.key ? `status=${item.key}` : ""}${sp.category ? `&category=${sp.category}` : ""}`}
                  style={{
                    padding: "3px 10px",
                    fontSize: "12px",
                    borderRadius: "3px",
                    border: "1px solid #e0e0e0",
                    background:
                      (sp.status || "") === item.key ? "#2980b9" : "white",
                    color: (sp.status || "") === item.key ? "white" : "#555",
                    cursor: "pointer",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Story List */}
          <div className="card card--padded">
            {stories.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">📖</div>
                <p className="empty-state__text">Không tìm thấy truyện nào</p>
              </div>
            ) : (
              stories.map((story) => (
                <div className="story-list-item" key={story.id}>
                  <Link
                    href={`/truyen/${story.slug}`}
                    className="story-list-item__cover"
                  >
                    {story.cover_image ? (
                      <img
                        src={story.cover_image.url}
                        alt={story.cover_image.alt}
                      />
                    ) : (
                      story.title.charAt(0)
                    )}
                  </Link>
                  <div className="story-list-item__info">
                    <Link
                      href={`/truyen/${story.slug}`}
                      className="story-list-item__title"
                    >
                      {story.title}
                      {story.is_hot && (
                        <>
                          {" "}
                          <span
                            className="badge badge--hot"
                            style={{
                              fontSize: "9px",
                              padding: "1px 4px",
                              verticalAlign: "middle",
                            }}
                          >
                            HOT
                          </span>
                        </>
                      )}
                    </Link>
                    <span className="story-list-item__author">
                      {story.author?.name}
                    </span>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {story.description}
                    </p>
                    <div className="story-list-item__meta">
                      <span className={`badge badge--${story.status}`}>
                        {story.status_label}
                      </span>
                      {story.chapter_count > 0 && (
                        <span>📚 {story.chapter_count} chương</span>
                      )}
                      {story.view_count > 0 && (
                        <span>👁 {formatViews(story.view_count)}</span>
                      )}
                      {story.rating_avg > 0 && (
                        <span>⭐ {story.rating_avg}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="pagination">
              {Array.from(
                { length: Math.min(meta.last_page, 10) },
                (_, i) => i + 1,
              ).map((page) => (
                <Link
                  key={page}
                  href={`/truyen?page=${page}${sp.category ? `&category=${sp.category}` : ""}${sp.status ? `&status=${sp.status}` : ""}`}
                  className={`pagination__btn ${page === (meta.current_page || 1) ? "pagination__btn--active" : ""}`}
                >
                  {page}
                </Link>
              ))}
              {meta.last_page > 10 && (
                <>
                  <span style={{ padding: "0 4px" }}>...</span>
                  <Link
                    href={`/truyen?page=${meta.last_page}`}
                    className="pagination__btn"
                  >
                    {meta.last_page}
                  </Link>
                </>
              )}
            </div>
          )}
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
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    fontSize: "13px",
                    color: "#333",
                    borderBottom: "1px dotted #eee",
                  }}
                >
                  <span>{cat.name}</span>
                  <span style={{ color: "#999", fontSize: "12px" }}>
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
