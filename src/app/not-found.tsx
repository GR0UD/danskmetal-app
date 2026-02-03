import styles from "@/styles/pages/not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.description}>
        Siden du leder efter findes desværre ikke.
      </p>
    </div>
  );
}
