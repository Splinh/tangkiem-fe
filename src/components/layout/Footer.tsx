import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footer__inner}>
          <div className={styles.footer__brand}>
            <div className={styles.footer__logo}>
              <span>⚔️</span> Tàng Kiếm
            </div>
            <p className={styles.footer__desc}>
              Tàng Kiếm - Nơi hội tụ hàng ngàn bộ truyện tiên hiệp, kiếm hiệp,
              huyền huyễn hay nhất. Đọc truyện online miễn phí, cập nhật liên
              tục mỗi ngày.
            </p>
          </div>

          <div className={styles.footer__links}>
            <h4>Thể loại</h4>
            <ul>
              <li>
                <Link href="/the-loai/tien-hiep">Tiên Hiệp</Link>
              </li>
              <li>
                <Link href="/the-loai/kiem-hiep">Kiếm Hiệp</Link>
              </li>
              <li>
                <Link href="/the-loai/huyen-huyen">Huyền Huyễn</Link>
              </li>
              <li>
                <Link href="/the-loai/do-thi">Đô Thị</Link>
              </li>
              <li>
                <Link href="/the-loai/ngon-tinh">Ngôn Tình</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footer__links}>
            <h4>Liên kết</h4>
            <ul>
              <li>
                <Link href="/bang-xep-hang">Bảng xếp hạng</Link>
              </li>
              <li>
                <Link href="/truyen">Danh sách truyện</Link>
              </li>
              <li>
                <Link href="/the-loai">Thể loại</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footer__bottom}>
          © 2026 Tàng Kiếm. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
