import styles from "@/styles/pages/menu.module.scss";

export interface DressingOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface DressingSelectionProps {
  dressings: DressingOption[];
  selectedDressing: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function DressingSelection({
  dressings,
  selectedDressing,
  onSelect,
  disabled = false,
}: DressingSelectionProps) {
  return (
    <div
      className={styles.section}
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <h2 className={styles.sectionTitle}>Vælg dressing</h2>
      <div className={styles.dressingGrid}>
        {dressings.map((dressing) => (
          <button
            key={dressing.id}
            className={`${styles.dressingButton} ${
              selectedDressing === dressing.id ? styles.active : ""
            }`}
            onClick={() => onSelect(dressing.id)}
          >
            <div className={styles.dressingIcon}>{dressing.icon}</div>
            <span className={styles.dressingName}>{dressing.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
