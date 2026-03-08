"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { clientFetch } from "@/lib/api";
import type { Story, ApiResponse } from "@/lib/types";

function formatViews(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K";
  return count.toString();
}

const TABS = [
  { key: "daily", label: "Hôm nay" },
  { key: "weekly", label: "Tuần này" },
  { key: "monthly", label: "Tháng này" },
  { key: "all-time", label: "Mọi lúc" },
];

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    clientFetch<{ data: Story[] }>(`/rankings/${activeTab}`)
      .then((res) => setStories(res.data || []))
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div
      className="container"
      style={{ paddingTop: "20px", paddingBottom: "40px" }}
    >
      <h1 className="section-title">
        <span className="section-title__icon">🏆</span>
        Bảng Xếp Hạng
      </h1>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? "tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ranking Table */}
      <div className="card">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
            Đang tải...
          </div>
        ) : stories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🏆</div>
            <p className="empty-state__text">Chưa có dữ liệu xếp hạng</p>
          </div>
        ) : (
          <table className="update-table">
            <thead>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>#</th>
                <th>Tên truyện</th>
                <th>Thể loại</th>
                <th>Số chương</th>
                <th style={{ textAlign: "right" }}>Lượt đọc</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((story, index) => (
                <tr key={story.id}>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: 700,
                        background:
                          index === 0
                            ? "linear-gradient(135deg, #FFD700, #FFA500)"
                            : index === 1
                              ? "linear-gradient(135deg, #C0C0C0, #A0A0A0)"
                              : index === 2
                                ? "linear-gradient(135deg, #CD7F32, #B8650A)"
                                : "#f4f4f4",
                        color: index < 3 ? "white" : "#999",
                      }}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/truyen/${story.slug}`}
                      className="update-table__title"
                    >
                      {story.title}
                    </Link>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        marginTop: "2px",
                      }}
                    >
                      {story.author?.name}
                    </div>
                  </td>
                  <td>
                    <Link
                      href={`/the-loai/${story.primary_category?.slug}`}
                      className="update-table__category"
                    >
                      {story.primary_category?.name}
                    </Link>
                  </td>
                  <td>{story.chapter_count}</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      color: "#2a5298",
                    }}
                  >
                    {formatViews(story.view_count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
