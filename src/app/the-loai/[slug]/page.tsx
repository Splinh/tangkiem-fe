import Link from "next/link";
import { getCategoryStories, getCategories } from "@/lib/api";
import type { Story } from "@/lib/types";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await getCategoryStories(slug);
    return {
      title: `Truyện ${res.data.name}`,
      description: `Đọc truyện ${res.data.name} hay nhất tại Tàng Kiếm`,
    };
  } catch {
    return { title: "Thể loại" };
  }
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
        <span className="story-card__category">{story.author?.name}</span>
      </div>
    </div>
  );
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;

  let category;
  let stories: Story[] = [];
  let categoriesList;

  try {
    const [catRes, allCatsRes] = await Promise.all([
      getCategoryStories(slug),
      getCategories(),
    ]);
    category = catRes.data;
    stories = catRes.stories?.data || [];
    categoriesList = allCatsRes.data || [];
  } catch {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state__icon">📚</div>
          <p className="empty-state__text">Không tìm thấy thể loại này</p>
          <Link
            href="/the-loai"
            style={{ marginTop: "16px", display: "inline-block" }}
          >
            ← Quay lại thể loại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav style={{ padding: "12px 0", fontSize: "13px", color: "#999" }}>
        <Link href="/" style={{ color: "#999" }}>
          Trang chủ
        </Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <Link href="/the-loai" style={{ color: "#999" }}>
          Thể loại
        </Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ color: "#333" }}>{category.name}</span>
      </nav>

      <div className="page-layout">
        <div className="page-layout__main">
          <h1 className="section-title">
            <span className="section-title__icon">📚</span>
            Truyện {category.name}
            <span className="section-title__link">
              {category.story_count} truyện
            </span>
          </h1>

          {stories.length > 0 ? (
            <div className="story-grid">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">📖</div>
              <p className="empty-state__text">
                Chưa có truyện trong thể loại này
              </p>
            </div>
          )}
        </div>

        <aside className="page-layout__sidebar">
          <div className="card card--padded">
            <h3 className="section-title">
              <span className="section-title__icon">📚</span>
              Thể Loại Khác
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {(categoriesList || [])
                .filter((c) => c.slug !== slug)
                .map((cat) => (
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
