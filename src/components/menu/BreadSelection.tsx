import styles from "@/app/(pages)/menu/[id]/menu.module.scss";

export interface BreadOption {
  id: "lyst" | "groft" | "rugbrød" | "glutenfri";
  name: string;
  icon: React.ReactNode;
}

interface BreadSelectionProps {
  breads: BreadOption[];
  selectedBread: string | null;
  onSelect: (id: "lyst" | "groft" | "rugbrød" | "glutenfri") => void;
  disabled?: boolean;
}

export default function BreadSelection({
  breads,
  selectedBread,
  onSelect,
  disabled = false,
}: BreadSelectionProps) {
  return (
    <div
      className={styles.section}
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <h2 className={styles.sectionTitle}>Vælg brødtype</h2>
      <div className={styles.optionGrid}>
        {breads.map((bread) => (
          <button
            key={bread.id}
            className={`${styles.optionButton} ${
              selectedBread === bread.id ? styles.active : ""
            }`}
            onClick={() => onSelect(bread.id)}
          >
            <div className={styles.optionIcon}>{bread.icon}</div>
            <span className={styles.optionName}>{bread.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
