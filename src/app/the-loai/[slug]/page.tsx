import Link from "next/link";
import { getCategoryStories, getCategories } from "@/lib/api";
import type { Metadata } from "next";
import CategoryStoryList from "@/components/story/CategoryStoryList";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

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

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;

  let category;
  let storiesMeta;
  let categoriesList;

  try {
    const [catRes, allCatsRes] = await Promise.all([
      getCategoryStories(slug, { page, per_page: "20" }),
      getCategories(),
    ]);
    category = catRes.data;
    storiesMeta = catRes.stories;
    categoriesList = allCatsRes.data || [];
  } catch {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state__icon">📚</div>
          <p className="empty-state__text">Không tìm thấy thể loại này</p>
          <Link href="/the-loai" style={{ marginTop: "16px", display: "inline-block" }}>
            ← Quay lại thể loại
          </Link>
        </div>
      </div>
    );
  }

  const stories = storiesMeta?.data || [];
  const currentPage = storiesMeta?.meta?.current_page || 1;
  const lastPage = storiesMeta?.meta?.last_page || 1;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="breadcrumb__sep">/</span>
        <Link href="/the-loai">Thể loại</Link>
        <span className="breadcrumb__sep">/</span>
        <span className="breadcrumb__current">{category.name}</span>
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

          {/* Client component: handles list/grid toggle + pagination */}
          <CategoryStoryList
            stories={stories}
            currentPage={currentPage}
            lastPage={lastPage}
            slug={slug}
          />
        </div>

        <aside className="page-layout__sidebar">
          <div className="card card--padded">
            <h3 className="section-title">
              <span className="section-title__icon">📚</span>
              Thể Loại Khác
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {(categoriesList || [])
                .filter((c) => c.slug !== slug)
                .map((cat) => (
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
