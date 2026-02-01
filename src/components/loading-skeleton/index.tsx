import styles from "./loading-skeleton.module.scss";

interface LoadingSkeletonProps {
  variant?: "page" | "session" | "order";
  count?: number;
}

export default function LoadingSkeleton({
  variant = "page",
  count = 1,
}: LoadingSkeletonProps) {
  if (variant === "page") {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (variant === "session") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <div className={styles.sessionContent}>
                <div className={styles.sessionTitleRow}>
                  <div className={styles.sessionTitle} />
                  <div className={styles.sessionBadge} />
                </div>
                <div className={styles.sessionDate} />
                <div className={styles.sessionCount} />
              </div>
              <div className={styles.sessionActions}>
                <div className={styles.actionButton} />
                <div className={styles.actionButton} />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === "order") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={styles.orderCard}>
            <div className={styles.orderCardContent}>
              <div className={styles.orderImage} />
              <div className={styles.orderDetails}>
                <div className={styles.orderName} />
                <div className={styles.orderCustomer} />
                <div className={styles.orderSpecs}>
                  <div className={styles.orderSpec} />
                  <div className={styles.orderSpec} />
                </div>
              </div>
            </div>
            <div className={styles.orderDeleteBtn} />
          </div>
        ))}
      </>
    );
  }

  return null;
}
