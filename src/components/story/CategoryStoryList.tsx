"use client";

import { useState } from "react";
import Link from "next/link";
import type { Story } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

// ─── View Toggle Icons ───
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="2" width="14" height="3" rx="1" />
      <rect x="1" y="7" width="14" height="3" rx="1" />
      <rect x="1" y="12" width="14" height="3" rx="1" />
    </svg>
  );
}

// ─── Story Card (Grid mode) ───
function StoryCardGrid({ story }: { story: Story }) {
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

// ─── Story Row (List mode) ───
function StoryRowList({ story }: { story: Story }) {
  const statusVariant =
    story.status === "completed"
      ? "completed"
      : story.status === "ongoing"
        ? "ongoing"
        : "paused";

  return (
    <div className="story-list-item">
      <Link href={`/truyen/${story.slug}`} className="story-list-item__cover">
        {story.cover_image ? (
          <img src={story.cover_image.url} alt={story.cover_image.alt} />
        ) : (
          story.title.charAt(0)
        )}
      </Link>
      <div className="story-list-item__info">
        <Link href={`/truyen/${story.slug}`} className="story-list-item__title">
          {story.title}
          {story.is_hot && (
            <>
              {" "}
              <Badge variant="hot" className="text-[9px] px-1 py-0 align-middle">
                HOT
              </Badge>
            </>
          )}
        </Link>
        <span className="story-list-item__author">{story.author?.name}</span>
        <div className="story-list-item__meta">
          <Badge variant={statusVariant}>{story.status_label}</Badge>
          {story.chapter_count > 0 && (
            <span>📚 {story.chapter_count} chương</span>
          )}
          {story.view_count > 0 && (
            <span>
              👁{" "}
              {story.view_count >= 1000
                ? `${(story.view_count / 1000).toFixed(0)}K`
                : story.view_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───
function Pagination({
  currentPage,
  lastPage,
  buildHref,
}: {
  currentPage: number;
  lastPage: number;
  buildHref: (page: number) => string;
}) {
  if (lastPage <= 1) return null;
  const pages = Array.from(
    { length: Math.min(lastPage, 10) },
    (_, i) => i + 1,
  );

  return (
    <div className="pagination mt-4">
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)} className="pagination__btn">
          ←
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`pagination__btn ${p === currentPage ? "pagination__btn--active" : ""}`}
        >
          {p}
        </Link>
      ))}
      {lastPage > 10 && (
        <>
          <span className="pagination__btn">...</span>
          <Link href={buildHref(lastPage)} className="pagination__btn">
            {lastPage}
          </Link>
        </>
      )}
      {currentPage < lastPage && (
        <Link href={buildHref(currentPage + 1)} className="pagination__btn">
          →
        </Link>
      )}
    </div>
  );
}

// ─── Main Component ───
type Props = {
  stories: Story[];
  currentPage: number;
  lastPage: number;
  slug: string;
};

export default function CategoryStoryList({
  stories,
  currentPage,
  lastPage,
  slug,
}: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <>
      {/* View Toggle */}
      <div className="view-toggle-bar">
        <span className="view-toggle-bar__count">
          {stories.length} truyện
        </span>
        <div className="view-toggle-group">
          <button
            onClick={() => setView("list")}
            className={`view-toggle-btn ${view === "list" ? "view-toggle-btn--active" : ""}`}
            title="Dạng danh sách"
            aria-label="Danh sách"
          >
            <ListIcon />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`view-toggle-btn ${view === "grid" ? "view-toggle-btn--active" : ""}`}
            title="Dạng lưới"
            aria-label="Lưới"
          >
            <GridIcon />
          </button>
        </div>
      </div>

      {/* Stories */}
      {stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📖</div>
          <p className="empty-state__text">Chưa có truyện trong thể loại này</p>
        </div>
      ) : view === "grid" ? (
        <div className="story-grid">
          {stories.map((story) => (
            <StoryCardGrid key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="card card--padded">
          {stories.map((story) => (
            <StoryRowList key={story.id} story={story} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        buildHref={(p) => `/the-loai/${slug}?page=${p}`}
      />
    </>
  );
}
