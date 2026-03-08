import Link from "next/link";
import { searchStories } from "@/lib/api";
import type { Metadata } from "next";

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Tìm kiếm: ${q}` : "Tìm kiếm truyện",
    description: q
      ? `Kết quả tìm kiếm cho "${q}" tại Tàng Kiếm`
      : "Tìm kiếm truyện tại Tàng Kiếm",
  };
}

function formatViews(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K";
  return count.toString();
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page } = await searchParams;

  const results = q
    ? await searchStories({ q, ...(page && { page }) }).catch(() => null)
    : null;

  const stories = results?.data || [];
  const meta = results?.meta;

  return (
    <div
      className="container"
      style={{ paddingTop: "20px", paddingBottom: "40px" }}
    >
      <h1 className="section-title">
        <span className="section-title__icon">🔍</span>
        {q ? `Kết quả tìm kiếm: "${q}"` : "Tìm kiếm truyện"}
      </h1>

      {/* Search Form */}
      <div className="card card--padded mb-24">
        <form action="/tim-kiem" method="GET">
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Nhập tên truyện, tác giả..."
              className="search-bar__input"
              style={{ paddingLeft: "16px", flex: 1 }}
              autoFocus
            />
            <button
              type="submit"
              className="reader__nav-btn reader__nav-btn--next"
              style={{ border: "none", whiteSpace: "nowrap" }}
            >
              🔍 Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {q ? (
        stories.length > 0 ? (
          <div className="card card--padded">
            <p
              style={{ fontSize: "13px", color: "#999", marginBottom: "12px" }}
            >
              Tìm thấy {meta?.total || stories.length} kết quả
            </p>
            {stories.map((story) => (
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
                    <span>📚 {story.chapter_count} chương</span>
                    <span>👁 {formatViews(story.view_count)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <p className="empty-state__text">
              Không tìm thấy kết quả nào cho &quot;{q}&quot;
            </p>
            <p style={{ fontSize: "13px", color: "#999", marginTop: "8px" }}>
              Thử tìm với từ khóa khác hoặc{" "}
              <Link href="/truyen">xem danh sách truyện</Link>
            </p>
          </div>
        )
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p className="empty-state__text">Nhập từ khóa để tìm kiếm truyện</p>
        </div>
      )}
    </div>
  );
}
