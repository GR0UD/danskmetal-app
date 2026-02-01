import { IoQrCode, IoTrash } from "react-icons/io5";
import styles from "@/app/(pages)/dashboard/dashboard.module.scss";

interface SessionHeaderProps {
  code: string;
  status: "active" | "closed";
  orderCount: number;
  uniqueCount: number;
  createdDate: string;
  createdTime: string;
  onQRClick: () => void;
  onDeleteClick: () => void;
}

export default function SessionHeader({
  code,
  status,
  orderCount,
  uniqueCount,
  createdDate,
  createdTime,
  onQRClick,
  onDeleteClick,
}: SessionHeaderProps) {
  return (
    <summary className={styles.cardSummary}>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            Menu Session
            <span
              className={`${styles.statusBadge} ${
                status === "active" ? styles.active : styles.closed
              }`}
            >
              {status === "active" ? "Aktiv" : "Lukket"}
            </span>
          </div>
          <div className={styles.cardActions}>
            <button
              className={styles.qrButton}
              onClick={(e) => {
                e.stopPropagation();
                onQRClick();
              }}
              title="Vis QR-kode"
            >
              <IoQrCode size={20} />
            </button>
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick();
              }}
              title="Slet session"
            >
              <IoTrash size={20} />
            </button>
          </div>
        </div>
        <div className={styles.cardDate}>
          {createdDate} kl. {createdTime}
        </div>
        <div className={styles.cardCount}>
          {orderCount} sandwich{orderCount !== 1 ? "er" : ""}
          {orderCount > 0 && <> ({uniqueCount} unikke)</>}
        </div>
      </div>
    </summary>
  );
}
