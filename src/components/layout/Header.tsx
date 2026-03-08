"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Danh sách", href: "/truyen" },
  { label: "Thể loại", href: "/the-loai" },
  { label: "Bảng xếp hạng", href: "/bang-xep-hang" },
  { label: "Tiên Hiệp", href: "/the-loai/tien-hiep" },
  { label: "Kiếm Hiệp", href: "/the-loai/kiem-hiep" },
  { label: "Huyền Huyễn", href: "/the-loai/huyen-huyen" },
  { label: "Đô Thị", href: "/the-loai/do-thi" },
  { label: "Ngôn Tình", href: "/the-loai/ngon-tinh" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__top}>
          <Link href="/" className={styles.header__logo}>
            <span className={styles["header__logo-icon"]}>⚔️</span>
            <span>Tàng Kiếm</span>
          </Link>

          <form className={styles.header__search} onSubmit={handleSearch}>
            <div className={styles["header__search-wrapper"]}>
              <span className={styles["header__search-icon"]}>🔍</span>
              <input
                type="text"
                className={styles["header__search-input"]}
                placeholder="Tìm truyện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <button className={styles["header__mobile-toggle"]}>☰</button>
        </div>
      </div>

      <nav className={styles.header__nav}>
        <div className="container">
          <ul className={styles["header__nav-list"]}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles["header__nav-link"]} ${
                    pathname === item.href
                      ? styles["header__nav-link--active"]
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
