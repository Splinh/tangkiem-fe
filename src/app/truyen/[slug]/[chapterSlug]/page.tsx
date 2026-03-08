import Link from "next/link";
import { getChapter } from "@/lib/api";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string; chapterSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, chapterSlug } = await params;
  try {
    const { data: chapter } = await getChapter(slug, chapterSlug);
    return {
      title: `${chapter.full_title || chapter.title} - ${chapter.story?.title}`,
      description:
        chapter.meta?.description || `Đọc ${chapter.title} tại Tàng Kiếm`,
    };
  } catch {
    return { title: "Đọc chương" };
  }
}

export default async function ChapterPage({ params }: Props) {
  const { slug, chapterSlug } = await params;

  let chapter;
  try {
    const res = await getChapter(slug, chapterSlug);
    chapter = res.data;
  } catch {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state__icon">📖</div>
          <p className="empty-state__text">Không tìm thấy chương này</p>
          <Link
            href={`/truyen/${slug}`}
            style={{ marginTop: "16px", display: "inline-block" }}
          >
            ← Quay lại truyện
          </Link>
        </div>
      </div>
    );
  }

  const story = chapter.story;
  const prevChapter = chapter.prev_chapter;
  const nextChapter = chapter.next_chapter;

  return (
    <div className="container">
      <div className="reader">
        {/* Header */}
        <div className="reader__header">
          <p className="reader__story-title">
            <Link href={`/truyen/${story.slug}`}>{story.title}</Link>
          </p>
          <h1 className="reader__chapter-title">
            {chapter.full_title || chapter.title}
          </h1>
        </div>

        {/* Navigation Top */}
        <div
          className="reader__nav"
          style={{ marginTop: 0, borderTop: "none", marginBottom: "24px" }}
        >
          {prevChapter ? (
            <Link
              href={`/truyen/${story.slug}/${prevChapter.slug}`}
              className="reader__nav-btn reader__nav-btn--prev"
            >
              ← Chương trước
            </Link>
          ) : (
            <button className="reader__nav-btn reader__nav-btn--prev" disabled>
              ← Chương trước
            </button>
          )}
          <Link
            href={`/truyen/${story.slug}`}
            className="reader__nav-btn reader__nav-btn--list"
          >
            📋 Mục lục
          </Link>
          {nextChapter ? (
            <Link
              href={`/truyen/${story.slug}/${nextChapter.slug}`}
              className="reader__nav-btn reader__nav-btn--next"
            >
              Chương sau →
            </Link>
          ) : (
            <button className="reader__nav-btn reader__nav-btn--next" disabled>
              Chương sau →
            </button>
          )}
        </div>

        {/* Content */}
        <div
          className="reader__content"
          dangerouslySetInnerHTML={{ __html: chapter.content }}
        />

        {/* Navigation Bottom */}
        <div className="reader__nav">
          {prevChapter ? (
            <Link
              href={`/truyen/${story.slug}/${prevChapter.slug}`}
              className="reader__nav-btn reader__nav-btn--prev"
            >
              ← Chương trước
            </Link>
          ) : (
            <button className="reader__nav-btn reader__nav-btn--prev" disabled>
              ← Chương trước
            </button>
          )}
          <Link
            href={`/truyen/${story.slug}`}
            className="reader__nav-btn reader__nav-btn--list"
          >
            📋 Mục lục
          </Link>
          {nextChapter ? (
            <Link
              href={`/truyen/${story.slug}/${nextChapter.slug}`}
              className="reader__nav-btn reader__nav-btn--next"
            >
              Chương sau →
            </Link>
          ) : (
            <button className="reader__nav-btn reader__nav-btn--next" disabled>
              Chương sau →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
