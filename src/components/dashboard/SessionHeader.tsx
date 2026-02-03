import { IoQrCode, IoTrash } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";
import styles from "@/styles/pages/dashboard.module.scss";

interface SessionHeaderProps {
  status: "active" | "closed";
  orderCount: number;
  uniqueCount: number;
  createdDate: string;
  createdTime: string;
  onQRClick: () => void;
  onDeleteClick: () => void;
  isDeleting?: boolean;
}

export default function SessionHeader({
  status,
  orderCount,
  uniqueCount,
  createdDate,
  createdTime,
  onQRClick,
  onDeleteClick,
  isDeleting = false,
}: SessionHeaderProps) {
  return (
    <summary className={styles.cardSummary}>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            Menukort
            <span
              className={`${styles.statusBadge} ${
                status === "active" ? styles.active : styles.closed
              }`}
            >
              {status === "active" ? "Aktiv" : "Lukket"}
            </span>
          </div>
        </div>
        <div className={styles.cardDate}>
          {createdDate} kl. {createdTime}
        </div>
        <div className={styles.cardCount}>
          {orderCount} Ordre{orderCount !== 1 ? "er" : ""}
          {orderCount > 0 && <> ({uniqueCount} unikke)</>}
        </div>
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
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ImSpinner8 size={20} className={styles.spinner} />
          ) : (
            <IoTrash size={20} />
          )}
        </button>
      </div>
    </summary>
  );
}
