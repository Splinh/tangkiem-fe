import Link from "next/link";
import { getCategories } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thể loại truyện",
  description:
    "Danh sách các thể loại truyện tại Tàng Kiếm - Tiên hiệp, kiếm hiệp, huyền huyễn, đô thị và nhiều thể loại khác.",
};

export default async function CategoriesPage() {
  const categoriesRes = await getCategories().catch(() => null);
  const categories = categoriesRes?.data || [];

  return (
    <div
      className="container"
      style={{ paddingTop: "20px", paddingBottom: "40px" }}
    >
      <h1 className="section-title">
        <span className="section-title__icon">📚</span>
        Thể Loại Truyện
      </h1>

      <div className="category-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/the-loai/${cat.slug}`}
            className="category-item"
          >
            <span className="category-item__name">{cat.name}</span>
            <span className="category-item__count">{cat.story_count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
