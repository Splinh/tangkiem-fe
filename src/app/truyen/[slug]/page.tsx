import Link from "next/link";
import { getStory, getChapters } from "@/lib/api";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: story } = await getStory(slug);
    return {
      title: `${story.title} - Đọc truyện online`,
      description: story.description || "Đọc truyện tại Tàng Kiếm",
    };
  } catch {
    return { title: "Chi tiết truyện" };
  }
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`rating__star ${star <= Math.round(rating) ? "rating__star--filled" : ""}`}
        >
          ★
        </span>
      ))}
      <span className="rating__value">{rating}/5</span>
    </span>
  );
}

function formatViews(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K";
  return count.toString();
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;

  let story;
  try {
    const res = await getStory(slug);
    story = res.data;
  } catch {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state__icon">📖</div>
          <p className="empty-state__text">Không tìm thấy truyện này</p>
          <Link
            href="/truyen"
            style={{ marginTop: "16px", display: "inline-block" }}
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  // Fetch chapters
  const chaptersRes = await getChapters(slug, { per_page: "50" }).catch(
    () => null,
  );
  const chapters = chaptersRes?.data || [];
  const chapterMeta = chaptersRes?.meta;
  const totalChapters = chapterMeta?.total || story.chapter_count || 0;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav style={{ padding: "12px 0", fontSize: "13px", color: "#999" }}>
        <Link href="/" style={{ color: "#999" }}>
          Trang chủ
        </Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <Link href="/truyen" style={{ color: "#999" }}>
          Truyện
        </Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "#333" }}>{story.title}</span>
      </nav>

      {/* Story Info Card */}
      <div className="card">
        <div className="story-detail">
          <div className="story-detail__cover">
            {story.cover_image ? (
              <img src={story.cover_image.url} alt={story.cover_image.alt} />
            ) : (
              story.title.charAt(0)
            )}
          </div>
          <div className="story-detail__info">
            <h1 className="story-detail__title">{story.title}</h1>

            <table className="story-detail__meta-table">
              <tbody>
                <tr>
                  <th>Tác giả</th>
                  <td>
                    <Link
                      href={`/truyen?author=${story.author?.slug}`}
                      style={{ color: "#2a5298" }}
                    >
                      {story.author?.name || "Đang cập nhật"}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th>Thể loại</th>
                  <td>
                    <Link
                      href={`/the-loai/${story.primary_category?.slug}`}
                      style={{ color: "#2a5298" }}
                    >
                      {story.primary_category?.name}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th>Trạng thái</th>
                  <td>
                    <span className={`badge badge--${story.status}`}>
                      {story.status_label}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Số chương</th>
                  <td>{totalChapters} chương</td>
                </tr>
                <tr>
                  <th>Lượt đọc</th>
                  <td>{formatViews(story.view_count)}</td>
                </tr>
                <tr>
                  <th>Đánh giá</th>
                  <td>
                    <RatingStars rating={story.rating_avg} />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        marginLeft: "8px",
                      }}
                    >
                      ({story.rating_count} đánh giá)
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Nguồn</th>
                  <td>
                    {story.origin_flag} {story.origin_label}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              {chapters.length > 0 && (
                <>
                  <Link
                    href={`/truyen/${story.slug}/${chapters[0].slug}`}
                    className="reader__nav-btn reader__nav-btn--next"
                    style={{ textDecoration: "none" }}
                  >
                    📖 Đọc từ đầu
                  </Link>
                  <Link
                    href={`/truyen/${story.slug}/${chapters[chapters.length - 1].slug}`}
                    className="reader__nav-btn reader__nav-btn--prev"
                    style={{ textDecoration: "none" }}
                  >
                    📖 Đọc mới nhất
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card card--padded mt-24">
        <h2 className="section-title">
          <span className="section-title__icon">📝</span>
          Giới thiệu
        </h2>
        <div className="story-detail__desc">
          {story.content ? (
            <div dangerouslySetInnerHTML={{ __html: story.content }} />
          ) : (
            <p>{story.description || "Chưa có mô tả."}</p>
          )}
        </div>
      </div>

      {/* Chapter List */}
      <div className="card card--padded mt-24">
        <h2 className="section-title">
          <span className="section-title__icon">📋</span>
          Danh sách chương
          <span className="section-title__link">{totalChapters} chương</span>
        </h2>
        <div className="chapter-list">
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <div className="chapter-list__item" key={chapter.id}>
                <Link href={`/truyen/${story.slug}/${chapter.slug}`}>
                  {chapter.full_title || chapter.title}
                </Link>
                <span>
                  {new Date(chapter.published_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
            ))
          ) : (
            <p
              style={{ color: "#999", padding: "20px 0", textAlign: "center" }}
            >
              Chưa có chương nào
            </p>
          )}
        </div>

        {/* Pagination */}
        {chapterMeta && chapterMeta.last_page > 1 && (
          <div className="pagination">
            {Array.from(
              { length: Math.min(chapterMeta.last_page, 10) },
              (_, i) => i + 1,
            ).map((page) => (
              <Link
                key={page}
                href={`/truyen/${story.slug}?chapter_page=${page}`}
                className={`pagination__btn ${page === chapterMeta.current_page ? "pagination__btn--active" : ""}`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
