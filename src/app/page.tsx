import Link from "next/link";
import { getStories, getCategories, getRankings } from "@/lib/api";
import type { Story } from "@/lib/types";

function formatViews(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K";
  return count.toString();
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

function StoryCard({ story }: { story: Story }) {
  return (
    <div className="story-card">
      <Link href={`/truyen/${story.slug}`}>
        <div className="story-card__cover">
          {story.cover_image ? (
            <img src={story.cover_image.url} alt={story.cover_image.alt} />
          ) : (
            story.title.charAt(0)
          )}
          <div className="story-card__badges">
            {story.is_hot && <span className="badge badge--hot">HOT</span>}
            {story.is_featured && (
              <span className="badge badge--featured">★</span>
            )}
          </div>
          {story.chapter_count > 0 && (
            <div className="story-card__chapters">
              {story.chapter_count} chương
            </div>
          )}
        </div>
      </Link>
      <div className="story-card__body">
        <Link href={`/truyen/${story.slug}`} className="story-card__title">
          {story.title}
        </Link>
        <span className="story-card__category">
          {story.primary_category?.name || "Chưa phân loại"}
        </span>
      </div>
    </div>
  );
}

function SidebarRanking({
  stories,
  title,
}: {
  stories: Story[];
  title: string;
}) {
  return (
    <div className="card card--padded">
      <h3 className="section-title">
        <span className="section-title__icon">🏆</span>
        {title}
      </h3>
      <div className="ranking-list">
        {stories.slice(0, 10).map((story) => (
          <div className="ranking-item" key={story.id}>
            <Link
              href={`/truyen/${story.slug}`}
              className="ranking-item__title"
            >
              {story.title}
            </Link>
            <span className="ranking-item__views">
              {formatViews(story.view_count)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  // Fetch real data from API
  const [storiesRes, categoriesRes, rankingsRes] = await Promise.all([
    getStories({ per_page: "24" }).catch(() => null),
    getCategories().catch(() => null),
    getRankings("daily").catch(() => null),
  ]);

  const stories = storiesRes?.data || [];
  const categories = categoriesRes?.data || [];
  const rankingStories = rankingsRes?.data || [];

  // Split stories for display
  const featuredStories = stories.slice(0, 8);
  const latestStories = stories;

  return (
    <div className="container">
      <div className="page-layout">
        {/* ═══ Main Content ═══ */}
        <div className="page-layout__main">
          {/* Featured / Hot Stories */}
          <section className="mb-24">
            <h2 className="section-title">
              <span className="section-title__icon">🔥</span>
              Truyện Mới
              <Link
                href="/truyen?sort=updated_at"
                className="section-title__link"
              >
                Xem tất cả →
              </Link>
            </h2>
            <div className="story-grid">
              {featuredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </section>

          {/* Latest Updates */}
          <section>
            <h2 className="section-title">
              <span className="section-title__icon">📖</span>
              Mới Cập Nhật
              <Link
                href="/truyen?sort=updated_at"
                className="section-title__link"
              >
                Xem tất cả →
              </Link>
            </h2>

            <div className="card">
              <table className="update-table">
                <thead>
                  <tr>
                    <th>Tên truyện</th>
                    <th>Thể loại</th>
                    <th>Số chương</th>
                    <th>Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {latestStories.map((story) => (
                    <tr key={story.id}>
                      <td>
                        <Link
                          href={`/truyen/${story.slug}`}
                          className="update-table__title"
                        >
                          {story.title}
                        </Link>
                        {story.is_hot && (
                          <>
                            {" "}
                            <span
                              className="badge badge--hot"
                              style={{ fontSize: "10px", padding: "1px 5px" }}
                            >
                              HOT
                            </span>
                          </>
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/the-loai/${story.primary_category?.slug || ""}`}
                          className="update-table__category"
                        >
                          {story.primary_category?.name}
                        </Link>
                      </td>
                      <td className="update-table__chapter">
                        <Link href={`/truyen/${story.slug}`}>
                          {story.chapter_count > 0
                            ? `${story.chapter_count} chương`
                            : "Đọc truyện"}
                        </Link>
                      </td>
                      <td className="update-table__time">
                        {timeAgo(story.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ═══ Sidebar ═══ */}
        <aside className="page-layout__sidebar">
          {/* Categories */}
          <div className="card card--padded mb-24">
            <h3 className="section-title">
              <span className="section-title__icon">📚</span>
              Thể Loại
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/the-loai/${cat.slug}`}
                  className="category-tag"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Rankings */}
          <SidebarRanking
            stories={
              rankingStories.length > 0 ? rankingStories : stories.slice(0, 10)
            }
            title="Top Lượt Đọc"
          />
        </aside>
      </div>
    </div>
  );
}
