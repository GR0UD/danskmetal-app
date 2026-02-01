"use client";

import styles from "./error.module.scss";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error for debugging (can be sent to error tracking service)
  console.error(_error);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Noget gik galt</h1>
      <p className={styles.description}>
        Der opstod en fejl. Prøv venligst igen.
      </p>
      <button className={styles.button} onClick={() => reset()}>
        Prøv igen
      </button>
    </div>
  );
}
